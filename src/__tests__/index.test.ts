import { NativeEventEmitter } from 'react-native';
import ScreenGuard from '../main/index';

// Mock the Native Modules
const mockNativeScreenGuard = {
    initSettings: jest.fn(),
    activateShield: jest.fn(),
    activateShieldWithoutEffect: jest.fn(),
    activateShieldWithBlurView: jest.fn(),
    activateShieldWithImage: jest.fn(),
    deactivateShield: jest.fn(),
};

const mockNativeSGScreenshot = {
    registerScreenshotEventListener: jest.fn(),
    removeScreenshotEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
};

const mockNativeSGScreenRecord = {
    registerScreenRecordingEventListener: jest.fn(),
    removeScreenRecordingEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
};

// Mock the modules specifically
jest.mock('../main/NativeScreenGuard', () => mockNativeScreenGuard);
jest.mock('../main/NativeSGScreenshot', () => mockNativeSGScreenshot);
jest.mock('../main/NativeSGScreenRecord', () => mockNativeSGScreenRecord);

jest.mock('react-native', () => {
    return {
        NativeEventEmitter: jest.fn().mockImplementation(() => {
            return {
                addListener: jest.fn(() => {
                    return { remove: jest.fn() };
                }),
                removeAllListeners: jest.fn(),
            };
        }),
        Platform: {
            OS: 'ios',
            select: jest.fn(),
        },
    };
});

describe('ScreenGuard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('init', () => {
        it('should call NativeScreenGuard.initSettings with provided data', async () => {
            const data = {
                enableCapture: true,
                enableRecord: true,
                enableContentMultitask: true,
            };
            await ScreenGuard.init(data);
            expect(mockNativeScreenGuard.initSettings).toHaveBeenCalledWith(data);
        });

        it('should call NativeScreenGuard.initSettings with default false values if no data provided', async () => {
            await ScreenGuard.init();
            expect(mockNativeScreenGuard.initSettings).toHaveBeenCalledWith({
                enableCapture: false,
                enableRecord: false,
                enableContentMultitask: false,
            });
        });
    });

    describe('register', () => {
        it('should call NativeScreenGuard.activateShield with correct color', async () => {
            await ScreenGuard.register({ backgroundColor: '#FF0000' });
            expect(mockNativeScreenGuard.activateShield).toHaveBeenCalled();
        });
    });

    describe('registerWithBlurView', () => {
        it('should throw error if radius < 1', async () => {
            await expect(
                ScreenGuard.registerWithBlurView({ radius: 0 })
            ).rejects.toThrow('radius must bigger than 1!');
        });

        it('should call NativeScreenGuard.activateShieldWithBlurView for valid radius', async () => {
            await ScreenGuard.registerWithBlurView({ radius: 15 });
            expect(mockNativeScreenGuard.activateShieldWithBlurView).toHaveBeenCalledWith(
                expect.objectContaining({
                    radius: 15,
                    timeAfterResume: 1000,
                })
            );
        });
    });

    describe('registerWithImage', () => {
        it('should throw error if uri empty', async () => {
            const data: any = { source: { uri: '' }, width: 100, height: 100 };
            await expect(
                ScreenGuard.registerWithImage(data)
            ).rejects.toThrow('uri must not be empty!');
        });

        it('should call NativeScreenGuard.activateShieldWithImage with valid payload', async () => {
            const data = {
                source: { uri: 'https://example.com/image.png' },
                width: 200,
                height: 200,
                alignment: 4,
            };
            await ScreenGuard.registerWithImage(data);
            expect(mockNativeScreenGuard.activateShieldWithImage).toHaveBeenCalled();
        });
    });

    describe('unregister', () => {
        it('should call NativeScreenGuard.deactivateShield', async () => {
            await ScreenGuard.unregister();
            expect(mockNativeScreenGuard.deactivateShield).toHaveBeenCalled();
        });
    });

    describe('EventListeners', () => {
        it('should register screenshot listener', () => {
            const callback = jest.fn();
            ScreenGuard.registerScreenshotEventListener(true, callback);
            expect(mockNativeSGScreenshot.registerScreenshotEventListener).toHaveBeenCalledWith(true);
        });

        it('should remove screenshot listener', () => {
            ScreenGuard.removeScreenshotEventListener();
            expect(mockNativeSGScreenshot.removeScreenshotEventListener).toHaveBeenCalled();
        });
    });
});
