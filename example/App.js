/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import * as React from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, TextInput, } from 'react-native';
import { Colors, DebugInstructions, Header, LearnMoreLinks, ReloadInstructions, } from 'react-native/Libraries/NewAppScreen';
import ScreenGuardModule from 'react-native-screenguard';
function Section({ children, title }) {
    const isDarkMode = useColorScheme() === 'dark';
    return (React.createElement(View, { style: styles.sectionContainer },
        React.createElement(Text, { style: [
                styles.sectionTitle,
                {
                    color: isDarkMode ? Colors.white : Colors.black,
                },
            ] }, title),
        React.createElement(Text, { style: [
                styles.sectionDescription,
                {
                    color: isDarkMode ? Colors.light : Colors.dark,
                },
            ] }, children)));
}
function App() {
    const isDarkMode = useColorScheme() === 'dark';
    const [currentState, setCurrentState] = React.useState('');
    const textInputRef = React.useRef(null);
    const [color, _] = React.useState('#4285F4');
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    return (React.createElement(SafeAreaView, { style: backgroundStyle },
        React.createElement(StatusBar, { barStyle: isDarkMode ? 'light-content' : 'dark-content', backgroundColor: backgroundStyle.backgroundColor }),
        React.createElement(ScrollView, { contentInsetAdjustmentBehavior: "automatic", style: backgroundStyle },
            React.createElement(Header, null),
            React.createElement(View, { style: {
                    backgroundColor: Colors.black,
                } },
                React.createElement(Pressable, { onPress: () => {
                        ScreenGuardModule.register(color, _ => {
                            Alert.alert('register with color ' + color);
                        });
                        setCurrentState('1');
                    } },
                    React.createElement(Text, { style: {
                            color: currentState === '1' ? '#00FF00' : Colors.white,
                        } }, "Turn on screenguard with color")),
                React.createElement(View, { style: { height: 23 } }),
                React.createElement(View, { style: { flexDirection: 'row' } },
                    React.createElement(Text, { style: {
                            color: currentState === '1' ? '#00FF00' : Colors.white,
                        } }, "this color will be registered"),
                    React.createElement(View, { style: {
                            marginLeft: 23,
                            width: 32,
                            height: 32,
                            backgroundColor: color,
                        } })),
                React.createElement(View, { style: { height: 72 } }),
                React.createElement(Pressable, { onPress: () => {
                        ScreenGuardModule.registerWithoutScreenguard(_ => {
                            Alert.alert('register without screenguard');
                        });
                        setCurrentState('2');
                    } },
                    React.createElement(Text, { style: {
                            color: currentState === '2' ? '#00FF00' : Colors.white,
                        } }, "Turn on without screenguard")),
                React.createElement(View, { style: { height: 72 } }),
                React.createElement(Pressable, { onPress: () => {
                        //CaptureProtection.allowScreenRecord();
                        ScreenGuardModule.unregister();
                        setCurrentState('3');
                        // textInputRef.current?.focus();
                    } },
                    React.createElement(Text, { style: {
                            color: currentState === '3' ? '#00FF00' : Colors.white,
                        } }, "Turn off screenguard")),
                React.createElement(TextInput, { ref: textInputRef, style: { borderColor: Colors.white, borderWidth: 1 } }),
                React.createElement(View, { style: { height: 72 } }),
                React.createElement(Pressable, { onPress: () => {
                        const data = {
                            radius: 34,
                            timeAfterResume: 1000,
                        };
                        ScreenGuardModule.registerWithBlurView(data, (_) => Alert.alert('register with blur radius 35'));
                        setCurrentState(() => '4');
                    } },
                    React.createElement(Text, { style: {
                            color: currentState === '4' ? '#00FF00' : Colors.white,
                        } }, "Turn on screenguard with blur radius = 35")),
                React.createElement(View, { style: { height: 72 } }),
                React.createElement(Pressable, { onPress: () => {
                        ScreenGuardModule.registerWithImage({
                            height: 150,
                            width: 200,
                            uri: 'https://www.icegif.com/wp-content/uploads/2022/09/icegif-386.gif',
                            backgroundColor: color,
                        }, _ => {
                            Alert.alert('register without screenguard');
                        });
                        setCurrentState('6');
                    } },
                    React.createElement(Text, { style: {
                            color: currentState === '6' ? '#00FF00' : Colors.white,
                        } }, "Turn on screenguard with Image")),
                React.createElement(Section, { title: "Step One" },
                    "Edit ",
                    React.createElement(Text, { style: styles.highlight }, "App.tsx"),
                    " to change this screen and then come back to see your edits."),
                React.createElement(Section, { title: "See Your Changes" },
                    React.createElement(ReloadInstructions, null)),
                React.createElement(Section, { title: "Debug" },
                    React.createElement(DebugInstructions, null)),
                React.createElement(Section, { title: "Learn More" }, "Read the docs to discover what to do next:"),
                React.createElement(LearnMoreLinks, null)))));
}
const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});
export default App;
