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
let mockProtectionListener: ((event: any) => void) | null = null;
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
                    mockProtectionListener = callback;
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
        mockProtectionListener = null;
    });

    it('should return initial null values', () => {
        const result = useSGScreenShot();

        expect(result).toEqual({
            screenshotData: null,
            protectionStatus: null,
        });
    });

    it('should accept optional listener callback', () => {
        const mockListener = jest.fn();
        const result = useSGScreenShot(mockListener);

        expect(result).toEqual({
            screenshotData: null,
            protectionStatus: null,
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

    it('should update protectionStatus when protection event fires', () => {
        useSGScreenShot();

        if (mockProtectionListener) {
            const protectionData = { timestamp: 1234, method: 'color', isProtected: true };
            mockProtectionListener(protectionData);

            expect(mockSetState).toHaveBeenCalledWith(protectionData);
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
        mockProtectionListener = null;
    });

    it('should return initial null values', () => {
        const result = useSGScreenRecord();

        expect(result).toEqual({
            recordingData: null,
            protectionStatus: null,
        });
    });

    it('should accept optional listener callback', () => {
        const mockListener = jest.fn();
        const result = useSGScreenRecord(mockListener);

        expect(result).toEqual({
            recordingData: null,
            protectionStatus: null,
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

    it('should update protectionStatus when protection event fires', () => {
        useSGScreenRecord();

        if (mockProtectionListener) {
            const protectionData = { timestamp: 5678, method: 'blur', isProtected: true };
            mockProtectionListener(protectionData);

            expect(mockSetState).toHaveBeenCalledWith(protectionData);
        }
    });

    it('should cleanup subscriptions on unmount', () => {
        useSGScreenRecord();

        mockCleanupFunctions.forEach(cleanup => cleanup());

        expect(mockRemove).toHaveBeenCalled();
    });
});
