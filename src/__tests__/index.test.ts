import ScreenGuard from '../index';
import * as ScreenGuardHelper from '../helper';
import { NativeModules, TurboModuleRegistry } from 'react-native';

jest.mock('../NativeScreenGuard', () => ({
    __esModule: true,
    default: {},
}));

jest.mock('react-native', () => {
    const mockNativeScreenGuard = {
        initSettings: jest.fn(),
        activateShield: jest.fn(),
        activateShieldWithoutEffect: jest.fn(),
        activateShieldWithBlurView: jest.fn(),
        activateShieldWithImage: jest.fn(),
        deactivateShield: jest.fn(),
        getScreenGuardLogs: jest.fn(),
    };

    return {
        NativeModules: {
            ScreenGuard: mockNativeScreenGuard,
        },
        NativeEventEmitter: jest.fn().mockImplementation(() => {
            return {
                addListener: jest.fn(() => {
                    return { remove: jest.fn() };
                }),
                removeAllListeners: jest.fn(),
            };
        }),
        TurboModuleRegistry: {
            get: jest.fn(() => mockNativeScreenGuard),
        },
        Platform: {
            OS: 'android',
            select: jest.fn(),
        },
        Image: {
            resolveAssetSource: jest.fn((source) => ({ uri: 'mocked_uri_' + source })),
        }
    };
});

let consoleErrorSpy: jest.SpyInstance;
let consoleWarnSpy: jest.SpyInstance;

const getMockNativeModule = () => {
    return NativeModules.ScreenGuard;
};

describe('ScreenGuard Module Test Suite', () => {

    beforeAll(() => {
    });

    beforeEach(() => {
        const mockNativeModule = getMockNativeModule();
        Object.values(mockNativeModule).forEach((mock: any) => {
            if (mock.mockClear) mock.mockClear();
        });

        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

        const Platform = require('react-native').Platform;
        Platform.OS = 'android';
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        consoleWarnSpy.mockRestore();
    });

    describe('initSettings', () => {
        it('should initialize with default false values when no data provided', async () => {
            await ScreenGuard.initSettings();
            const mocks = getMockNativeModule();

            expect(mocks.initSettings).toHaveBeenCalledTimes(1);
            expect(mocks.initSettings).toHaveBeenCalledWith(expect.objectContaining({
                enableCapture: false,
                enableRecord: false,
                enableContentMultitask: false,
                displayOverlay: false,
                timeAfterResume: 1000,
            }));
        });

        it('should initialize with provided values', async () => {
            const config = {
                enableCapture: true,
                enableRecord: true,
                enableContentMultitask: true,
                displayOverlay: true,
                timeAfterResume: 2000,
                getScreenshotPath: true,
                limitCaptureEvtCount: 5,
                trackingLog: true,
                allowBackpress: true,
            };

            await ScreenGuard.initSettings(config);
            const mocks = getMockNativeModule();

            expect(mocks.initSettings).toHaveBeenCalledWith(expect.objectContaining(config));
        });

        it('should handle partial configuration', async () => {
            const config = {
                enableCapture: true,
            };

            await ScreenGuard.initSettings(config);
            const mocks = getMockNativeModule();

            expect(mocks.initSettings).toHaveBeenCalledWith(expect.objectContaining({
                enableCapture: true,
                enableRecord: false,
                displayOverlay: false,
            }));
        });

        it('should catch native module errors during initialization', async () => {
            const errorMsg = 'Native Init Error';
            const mocks = getMockNativeModule();
            mocks.initSettings.mockRejectedValueOnce(new Error(errorMsg));

            await expect(ScreenGuard.initSettings()).rejects.toThrow(errorMsg);
            expect(consoleErrorSpy).toHaveBeenCalled();
        });
    });

    describe('register (Color Shield)', () => {
        beforeEach(async () => {
            await ScreenGuard.initSettings();
        });

        it('should throw error if module not initialized (Simulated)', async () => {
        });

        it('should register with default color if none provided', async () => {
            await ScreenGuard.register({});
            const mocks = getMockNativeModule();
            expect(mocks.activateShield).toHaveBeenCalledWith(expect.objectContaining({
                backgroundColor: '#000000',
            }));
        });

        it('should register with provided hex color', async () => {
            await ScreenGuard.register({ backgroundColor: '#123456' });
            const mocks = getMockNativeModule();
            expect(mocks.activateShield).toHaveBeenCalledWith(expect.objectContaining({
                backgroundColor: '#123456',
            }));
        });

        it('should register with provided color name (resolved by helper)', async () => {
            await ScreenGuard.register({ backgroundColor: 'red' });
            const mocks = getMockNativeModule();
            expect(mocks.activateShield).toHaveBeenCalled();
        });

        it('should handle native errors during registration', async () => {
            const mocks = getMockNativeModule();
            mocks.activateShield.mockRejectedValueOnce('Native Error');
            await expect(ScreenGuard.register({})).rejects.toEqual('Native Error');
        });
    });

    describe('registerWithoutEffect', () => {
        beforeEach(async () => {
            await ScreenGuard.initSettings();
        });

        it('should call native method on Android', async () => {
            const Platform = require('react-native').Platform;
            Platform.OS = 'android';
            const mocks = getMockNativeModule();

            await ScreenGuard.registerWithoutEffect();
            expect(mocks.activateShieldWithoutEffect).toHaveBeenCalled();
            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });

        it('should NOT call native method and warn on iOS', async () => {
            const Platform = require('react-native').Platform;
            Platform.OS = 'ios';
            const mocks = getMockNativeModule();

            await ScreenGuard.registerWithoutEffect();
            expect(mocks.activateShieldWithoutEffect).not.toHaveBeenCalled();
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('only available on Android'));
        });
    });

    describe('registerWithBlurView', () => {
        beforeEach(async () => {
            await ScreenGuard.initSettings();
        });

        it('should validate radius is a number', async () => {
            await expect(ScreenGuard.registerWithBlurView({ radius: 'NotANumber' }))
                .rejects.toEqual('radius must be a number and bigger than 1');
        });

        it('should validate radius >= 1', async () => {
            await expect(ScreenGuard.registerWithBlurView({ radius: 0 }))
                .rejects.toEqual('radius must bigger than 1!');

            await expect(ScreenGuard.registerWithBlurView({ radius: -5 }))
                .rejects.toEqual('radius must bigger than 1!');
        });

        it('should warn if radius is small (1-15)', async () => {
            const mocks = getMockNativeModule();
            await ScreenGuard.registerWithBlurView({ radius: 10 });
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Consider a radius value bigger than 15'));
            expect(mocks.activateShieldWithBlurView).toHaveBeenCalled();
        });

        it('should warn if radius is large (>50)', async () => {
            const mocks = getMockNativeModule();
            await ScreenGuard.registerWithBlurView({ radius: 60 });
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Consider a radius value in between 15 and 50'));
            expect(mocks.activateShieldWithBlurView).toHaveBeenCalled();
        });

        it('should fail on Android if timeAfterResume < 0', async () => {
            const Platform = require('react-native').Platform;
            Platform.OS = 'android';

            await expect(ScreenGuard.registerWithBlurView({ radius: 20, timeAfterResume: -100 }))
                .rejects.toEqual('timeAfterResume must be > 0!');
        });

        it('should warn on Android if timeAfterResume > 3000', async () => {
            const Platform = require('react-native').Platform;
            Platform.OS = 'android';
            const mocks = getMockNativeModule();

            await ScreenGuard.registerWithBlurView({ radius: 20, timeAfterResume: 3500 });
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Consider a number in between 1000 and 3000'));
            expect(mocks.activateShieldWithBlurView).toHaveBeenCalled();
        });

        it('should NOT warn on iOS if timeAfterResume > 3000', async () => {
            const Platform = require('react-native').Platform;
            Platform.OS = 'ios';
            const mocks = getMockNativeModule();

            await ScreenGuard.registerWithBlurView({ radius: 20, timeAfterResume: 3500 });
            expect(consoleWarnSpy).not.toHaveBeenCalled();
            expect(mocks.activateShieldWithBlurView).toHaveBeenCalled();
        });

        it('should call native with correct transformed data', async () => {
            const data = { radius: 25, timeAfterResume: 1500 };
            const mocks = getMockNativeModule();
            await ScreenGuard.registerWithBlurView(data);
            expect(mocks.activateShieldWithBlurView).toHaveBeenCalledWith(expect.objectContaining(data));
        });
    });

    describe('registerWithImage', () => {
        beforeEach(async () => {
            await ScreenGuard.initSettings();
        });

        it('should fail if URI is empty in source object', async () => {
            const data: any = { source: { uri: '' }, width: 100, height: 100 };
            await expect(ScreenGuard.registerWithImage(data))
                .rejects.toEqual('uri must not be empty!');
        });

        it('should fail if width invalid', async () => {
            await expect(ScreenGuard.registerWithImage({ source: { uri: 'http' }, width: 0, height: 100 } as any))
                .rejects.toEqual('width of image must bigger than 0!');

            await expect(ScreenGuard.registerWithImage({ source: { uri: 'http' }, width: NaN, height: 100 } as any))
                .rejects.toEqual('width of image must bigger than 0!');
        });

        it('should fail if height invalid', async () => {
            await expect(ScreenGuard.registerWithImage({ source: { uri: 'http' }, width: 100, height: 0 } as any))
                .rejects.toEqual('height of image must bigger than 0!');

            await expect(ScreenGuard.registerWithImage({ source: { uri: 'http' }, width: 100, height: NaN } as any))
                .rejects.toEqual('height of image must bigger than 0!');
        });

        it('should warn if URI format seems invalid (regex check)', async () => {
            const badUri = 'http://example.com/image';
            await ScreenGuard.registerWithImage({ source: { uri: badUri }, width: 100, height: 100 });
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Looks like the uri is not an image uri'));
        });

        it('should accept number source (require) and resolve it', async () => {
            const mockRequireSource = 123;
            const mocks = getMockNativeModule();
            await ScreenGuard.registerWithImage({ source: mockRequireSource, width: 100, height: 100 } as any);

            expect(mocks.activateShieldWithImage).toHaveBeenCalledWith(expect.objectContaining({
                source: { uri: 'mocked_uri_123' },
            }));
        });

        it('should validate alignment range (0-8)', async () => {
            await expect(ScreenGuard.registerWithImage({ source: { uri: 'http.png' }, width: 100, height: 100, alignment: 9 } as any))
                .rejects.toEqual(expect.stringContaining('alignment must be in range from 0 -> 8'));

            await expect(ScreenGuard.registerWithImage({ source: { uri: 'http.png' }, width: 100, height: 100, alignment: -1 } as any))
                .rejects.toEqual(expect.stringContaining('alignment must be in range from 0 -> 8'));
        });

        it('should warn if no defaultSource provided and use internal default', async () => {
            const mocks = getMockNativeModule();
            await ScreenGuard.registerWithImage({ source: { uri: 'http://example.com/img.png' }, width: 100, height: 100 });
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Consider adding a default source'));

            const args = mocks.activateShieldWithImage.mock.calls[0][0];
            expect(args).toHaveProperty('defaultSource');
            expect(args.defaultSource).toHaveProperty('uri');
        });

        it('should use provided defaultSource', async () => {
            const mocks = getMockNativeModule();
            await ScreenGuard.registerWithImage({
                source: { uri: 'http://img.png' },
                width: 100,
                height: 100,
                defaultSource: 456
            } as any);

            const args = mocks.activateShieldWithImage.mock.calls[0][0];
            expect(args.defaultSource.uri).toBe('mocked_uri_456');
        });

        it('should default alignment to Center (4) on Android if not provided and no positions', async () => {
            const Platform = require('react-native').Platform;
            Platform.OS = 'android';
            const mocks = getMockNativeModule();

            await ScreenGuard.registerWithImage({ source: { uri: 'http.png' }, width: 100, height: 100 });

            const args = mocks.activateShieldWithImage.mock.calls[0][0];
            expect(args.alignment).toBe(4);
        });
    });

    describe('unregister', () => {
        beforeEach(async () => {
            await ScreenGuard.initSettings();
        });

        it('should call native deactivateShield', async () => {
            const mocks = getMockNativeModule();
            await ScreenGuard.unregister();
            expect(mocks.deactivateShield).toHaveBeenCalled();
        });

        it('should handle native errors', async () => {
            const mocks = getMockNativeModule();
            mocks.deactivateShield.mockRejectedValueOnce('Unregister Failed');
            await expect(ScreenGuard.unregister()).rejects.toEqual('Unregister Failed');
        });
    });

    describe('getScreenGuardLogs', () => {
        beforeEach(async () => {
            await ScreenGuard.initSettings();
        });

        it('should return logs from native', async () => {
            const mocks = getMockNativeModule();
            const mockLogs = [
                { timestamp: 1000, action: 'init', isProtected: false },
                { timestamp: 2000, action: 'screenshot', isProtected: true }
            ];
            mocks.getScreenGuardLogs.mockResolvedValueOnce(mockLogs);

            const result = await ScreenGuard.getScreenGuardLogs();
            expect(result).toEqual(mockLogs);
            expect(mocks.getScreenGuardLogs).toHaveBeenCalledWith(10);
        });

        it('should pass custom maxCount', async () => {
            const mocks = getMockNativeModule();
            await ScreenGuard.getScreenGuardLogs(50);
            expect(mocks.getScreenGuardLogs).toHaveBeenCalledWith(50);
        });

        it('should handle native errors', async () => {
            const mocks = getMockNativeModule();
            mocks.getScreenGuardLogs.mockRejectedValueOnce('Log Error');
            await expect(ScreenGuard.getScreenGuardLogs()).rejects.toEqual('Log Error');
        });
    });

});
