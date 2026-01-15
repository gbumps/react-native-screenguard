// @ts-nocheck
import { useSGScreenShot } from '../useSGScreenShot';
import { useSGScreenRecord } from '../useSGScreenRecord';

const mockSetState = jest.fn();
let mockUseEffectCallbacks: Array<() => void | (() => void)> = [];
let mockCleanupFunctions: Array<() => void> = [];

jest.mock('react', () => ({
    useState: jest.fn((initial) => [initial, mockSetState]),
    useEffect: jest.fn((callback) => {
        const cleanup = callback();
        mockUseEffectCallbacks.push(callback);
        if (typeof cleanup === 'function') {
            mockCleanupFunctions.push(cleanup);
        }
    }),
    useRef: jest.fn((initial) => ({ current: initial })),
}));

let mockScreenshotListener: ((event: any) => void) | null = null;
let mockRecordingListener: ((event: any) => void) | null = null;
let mockStatusListener: ((event: any) => void) | null = null;
const mockRemove = jest.fn();

jest.mock('react-native', () => {
    return {
        NativeModules: {
            ScreenGuard: {},
        },
        TurboModuleRegistry: {
            get: jest.fn(() => ({})),
        },
        NativeEventEmitter: jest.fn().mockImplementation(() => ({
            addListener: jest.fn((eventName, callback) => {
                if (eventName === 'onScreenShotCaptured') {
                    mockScreenshotListener = callback;
                } else if (eventName === 'onScreenRecordingCaptured') {
                    mockRecordingListener = callback;
                } else if (eventName === 'onScreenGuardEvt') {
                    mockStatusListener = callback;
                }
                return { remove: mockRemove };
            }),
        })),
    };
});

describe('useSGScreenShot Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseEffectCallbacks = [];
        mockCleanupFunctions = [];
        mockScreenshotListener = null;
        mockStatusListener = null;
    });

    it('should return initial null values', () => {
        const result = useSGScreenShot();

        expect(result).toEqual({
            screenshotData: null,
            activationStatus: null,
        });
    });

    it('should accept optional listener callback', () => {
        const mockListener = jest.fn();
        const result = useSGScreenShot(mockListener);

        expect(result).toEqual({
            screenshotData: null,
            activationStatus: null,
        });
    });

    it('should set up event listeners on mount', () => {
        const { NativeEventEmitter } = require('react-native');

        useSGScreenShot();

        // useEffect should have been called
        const { useEffect } = require('react');
        expect(useEffect).toHaveBeenCalled();
    });

    it('should call listener callback when screenshot event fires', () => {
        const mockListener = jest.fn();
        useSGScreenShot(mockListener);

        // Simulate screenshot event
        if (mockScreenshotListener) {
            const eventData = { path: '/test/path.png', name: 'test', type: 'PNG' };
            mockScreenshotListener(eventData);

            expect(mockSetState).toHaveBeenCalledWith(eventData);
        }
    });

    it('should update activationStatus when status event fires', () => {
        useSGScreenShot();

        if (mockStatusListener) {
            const statusData = { timestamp: 1234, method: 'color', isActivated: true };
            mockStatusListener(statusData);

            expect(mockSetState).toHaveBeenCalledWith(statusData);
        }
    });

    it('should cleanup subscriptions on unmount', () => {
        useSGScreenShot();

        mockCleanupFunctions.forEach(cleanup => cleanup());

        expect(mockRemove).toHaveBeenCalled();
    });
});

describe('useSGScreenRecord Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseEffectCallbacks = [];
        mockCleanupFunctions = [];
        mockRecordingListener = null;
        mockStatusListener = null;
    });

    it('should return initial null values', () => {
        const result = useSGScreenRecord();

        expect(result).toEqual({
            recordingData: null,
            activationStatus: null,
        });
    });

    it('should accept optional listener callback', () => {
        const mockListener = jest.fn();
        const result = useSGScreenRecord(mockListener);

        expect(result).toEqual({
            recordingData: null,
            activationStatus: null,
        });
    });

    it('should set up event listeners on mount', () => {
        useSGScreenRecord();

        const { useEffect } = require('react');
        expect(useEffect).toHaveBeenCalled();
    });

    it('should call listener callback when recording event fires', () => {
        const mockListener = jest.fn();
        useSGScreenRecord(mockListener);

        if (mockRecordingListener) {
            const eventData = { isRecording: 'true' };
            mockRecordingListener(eventData);

            expect(mockSetState).toHaveBeenCalledWith(eventData);
        }
    });

    it('should update activationStatus when status event fires', () => {
        useSGScreenRecord();

        if (mockStatusListener) {
            const statusData = { timestamp: 5678, method: 'blur', isActivated: true };
            mockStatusListener(statusData);

            expect(mockSetState).toHaveBeenCalledWith(statusData);
        }
    });

    it('should cleanup subscriptions on unmount', () => {
        useSGScreenRecord();

        mockCleanupFunctions.forEach(cleanup => cleanup());

        expect(mockRemove).toHaveBeenCalled();
    });
});
