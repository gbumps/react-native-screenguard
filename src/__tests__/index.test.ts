import ScreenGuard from '../index';
import { NativeEventEmitter } from 'react-native';

const mockInitSettings = jest.fn();
const mockActivateShield = jest.fn();
const mockActivateShieldWithoutEffect = jest.fn();
const mockActivateShieldWithBlurView = jest.fn();
const mockActivateShieldWithImage = jest.fn();
const mockDeactivateShield = jest.fn();
const mockGetScreenGuardLogs = jest.fn();

// Mock the Native Module
jest.mock('../NativeScreenGuard', () => {
    return {
        __esModule: true,
        default: {
            initSettings: mockInitSettings,
            activateShield: mockActivateShield,
            activateShieldWithoutEffect: mockActivateShieldWithoutEffect,
            activateShieldWithBlurView: mockActivateShieldWithBlurView,
            activateShieldWithImage: mockActivateShieldWithImage,
            deactivateShield: mockDeactivateShield,
            getScreenGuardLogs: mockGetScreenGuardLogs,
        },
    };
});

jest.mock('react-native', () => {
    return {
        NativeModules: {
            ScreenGuard: {
                initSettings: jest.fn(),
                activateShield: jest.fn(),
                activateShieldWithoutEffect: jest.fn(),
                activateShieldWithBlurView: jest.fn(),
                activateShieldWithImage: jest.fn(),
                deactivateShield: jest.fn(),
                getScreenGuardLogs: jest.fn(),
            },
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
            get: jest.fn(() => ({
                initSettings: jest.fn(),
                activateShield: jest.fn(),
                activateShieldWithoutEffect: jest.fn(),
                activateShieldWithBlurView: jest.fn(),
                activateShieldWithImage: jest.fn(),
                deactivateShield: jest.fn(),
                getScreenGuardLogs: jest.fn(),
            })),
        },
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
            await ScreenGuard.initSettings(data);
            expect(mockInitSettings).toHaveBeenCalledWith(expect.objectContaining(data));
        });

        it('should call NativeScreenGuard.initSettings with default false values if no data provided', async () => {
            await ScreenGuard.initSettings();
            expect(mockInitSettings).toHaveBeenCalledWith(expect.objectContaining({
                enableCapture: false,
                enableRecord: false,
                enableContentMultitask: false,
            }));
        });
    });

    describe('register', () => {
        beforeEach(async () => {
            // Initialize before each test in this block
            await ScreenGuard.initSettings();
        });

        it('should call NativeScreenGuard.activateShield with correct color', async () => {
            await ScreenGuard.register({ backgroundColor: '#FF0000' });
            expect(mockActivateShield).toHaveBeenCalled();
        });

        it('should throw error if not initialized', async () => {
            await expect(
                ScreenGuard.register({ backgroundColor: '#FF0000' })
            ).rejects.toEqual('ScreenGuard is not initialized. Please call initSettings() first!');
        });
    });

    describe('registerWithBlurView', () => {
        beforeEach(async () => {
            await ScreenGuard.initSettings();
        });

        it('should throw error if radius < 1', async () => {
            await expect(
                ScreenGuard.registerWithBlurView({ radius: 0 })
            ).rejects.toEqual('radius must bigger than 1!');
        });

        it('should call NativeScreenGuard.activateShieldWithBlurView for valid radius', async () => {
            await ScreenGuard.registerWithBlurView({ radius: 15 });
            expect(mockActivateShieldWithBlurView).toHaveBeenCalledWith(
                expect.objectContaining({
                    radius: 15,
                    timeAfterResume: 1000,
                })
            );
        });
    });

    describe('registerWithImage', () => {
        beforeEach(async () => {
            await ScreenGuard.initSettings();
        });

        it('should throw error if uri empty', async () => {
            const data: any = { source: { uri: '' }, width: 100, height: 100 };
            await expect(
                ScreenGuard.registerWithImage(data)
            ).rejects.toEqual('uri must not be empty!');
        });

        it('should call NativeScreenGuard.activateShieldWithImage with valid payload', async () => {
            const data = {
                source: { uri: 'https://example.com/image.png' },
                width: 200,
                height: 200,
                alignment: 4,
            };
            await ScreenGuard.registerWithImage(data);
            expect(mockActivateShieldWithImage).toHaveBeenCalled();
        });
    });

    describe('unregister', () => {
        beforeEach(async () => {
            await ScreenGuard.initSettings();
        });

        it('should call NativeScreenGuard.deactivateShield', async () => {
            await ScreenGuard.unregister();
            expect(mockDeactivateShield).toHaveBeenCalled();
        });
    });

});
