declare const _default: {
    /**
     * activate screenshot blocking (iOS13+, Android 5+)
     * @param string capturedBackgroundColor (iOS only) background color layout after taking a screenshot
     * @param void callback callback after a screenshot has been taken
     */
    register(capturedBackgroundColor: String | null, callback: (arg0: any) => void): void;
    /**
     * Deactivate screenshot
     */
    unregister(): void;
};
export default _default;
//# sourceMappingURL=index.d.ts.map