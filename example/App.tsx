/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import ScreenGuardModule from 'react-native-screenguard';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentState, setCurrentState] = React.useState('');
  const textInputRef = React.useRef<TextInput | null>(null);

  const [color, _] = React.useState('#4285F4');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />

        <View
          style={{
            backgroundColor: Colors.black,
          }}>
          <Pressable
            onPress={() => {
              ScreenGuardModule.register(color);
              setCurrentState('1');
            }}>
            <Text
              style={{
                color: currentState === '1' ? '#00FF00' : Colors.white,
              }}>
              Turn on screenguard with color
            </Text>
          </Pressable>
          <View style={{height: 23}} />
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: currentState === '1' ? '#00FF00' : Colors.white,
              }}>
              this color will be registered
            </Text>
            <View
              style={{
                marginLeft: 23,
                width: 32,
                height: 32,
                backgroundColor: color,
              }}
            />
          </View>
          <View style={{height: 72}} />
          <Pressable
            onPress={() => {
              ScreenGuardModule.registerWithoutScreenguard(_ => {
                Alert.alert('register without screenguard');
              });
              setCurrentState('2');
            }}>
            <Text
              style={{
                color: currentState === '2' ? '#00FF00' : Colors.white,
              }}>
              Turn on without screenguard
            </Text>
          </Pressable>
          <View style={{height: 72}} />
          <Pressable
            onPress={() => {
              ScreenGuardModule.unregister();
              setCurrentState('3');
            }}>
            <Text
              style={{
                color: currentState === '3' ? '#00FF00' : Colors.white,
              }}>
              Turn off screenguard
            </Text>
          </Pressable>
          <TextInput
            ref={textInputRef}
            style={{borderColor: Colors.white, borderWidth: 1}}
          />
          <View style={{height: 72}} />
          <Pressable
            onPress={() => {
              const data =  {
                radius: 34,
                timeAfterResume: 1000,
              };
              ScreenGuardModule.registerWithBlurView(data);
              setCurrentState(() => '4');
            }}>
            <Text
              style={{
                color: currentState === '4' ? '#00FF00' : Colors.white,
              }}>
              Turn on screenguard with blur radius = 35
            </Text>
          </Pressable>
          <View style={{height: 72}} />
          <Pressable
            onPress={() => {
              ScreenGuardModule.registerWithImage(
                {
                  height: 150,
                  width: 200,
                  uri: 'https://www.icegif.com/wp-content/uploads/2022/09/icegif-386.gif',
                  backgroundColor: color,
                },
              );
              setCurrentState('6');
            }}>
            <Text
              style={{
                color: currentState === '6' ? '#00FF00' : Colors.white,
              }}>
              Turn on screenguard with Image
            </Text>
          </Pressable>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
