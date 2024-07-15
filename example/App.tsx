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
  Modal,
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

import ScreenGuardModule, {ScreenGuardConstants} from '../';

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

  // const {isPrevent, status} = useCaptureProtection();

  const textInputRef = React.useRef<TextInput | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const [color, _] = React.useState('#DB4437');

  // React.useEffect(() => {
  //   ScreenGuardModule.register('#000000', _ => {
  //     Alert.alert('register with blur radius 35');
  //   });
  //   ScreenGuardModule.register('#000000', _ => {
  //     Alert.alert('register with blur radius 35');
  //   });
  // }, []);

  // ScreenGuardModule.registerWithoutScreenguard(_ => {
  //   Alert.alert('123');
  // });
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
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
        <Pressable style={styles.button} onPress={toggleModal}>
          <Text style={styles.buttonText}>Show Modal</Text>
        </Pressable>
        {modalVisible && (
          <Modal
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Hello World!</Text>

                <Pressable
                  style={{...styles.button, backgroundColor: '#2196F3'}}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.buttonText}>Hide Modal</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
        <View
          style={{
            backgroundColor: Colors.black,
          }}>
          <Pressable
            onPress={() => {
              ScreenGuardModule.register({
                backgroundColor: color,
                timeAfterResume: 2000,
              });
              ScreenGuardModule.registerScreenshotEventListener(false, event =>
                Alert.alert(`register screenshot,`),
              );
              ScreenGuardModule.registerScreenRecordingEventListener(_ =>
                Alert.alert('register screen record'),
              );
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
              ScreenGuardModule.registerScreenshotEventListener(true, data => {
                if (data != null) {
                  console.log('register screenshot listener', data.path);
                  console.log('register screenshot file name', data.name);
                  console.log('register screenshot file type', data.type);
                }
              });
              setCurrentState('2');
            }}>
            <Text
              style={{
                color: currentState === '2' ? '#00FF00' : Colors.white,
              }}>
              Turn on screenshot listener
            </Text>
          </Pressable>
          <View style={{height: 72}} />
          <Pressable
            onPress={() => {
              ScreenGuardModule.registerScreenRecordingEventListener(_ => {
                Alert.alert('register screen recording listener');
              });
              setCurrentState('3');
            }}>
            <Text
              style={{
                color: currentState === '3' ? '#00FF00' : Colors.white,
              }}>
              Turn on screen record listener
            </Text>
          </Pressable>
          <View style={{height: 72}} />
          <Pressable
            onPress={() => {
              ScreenGuardModule.unregister();
              setCurrentState('4');
            }}>
            <Text
              style={{
                color: currentState === '4' ? '#00FF00' : Colors.white,
              }}>
              Turn off screenguard
            </Text>
          </Pressable>
          <TextInput
            ref={textInputRef}
            style={{borderColor: Colors.white, borderWidth: 1, height: 40}}
            multiline={true}
            autoCapitalize="sentences"
            autoCorrect={true}
            keyboardType="default"
            returnKeyType="done"
            onKeyPress={() => {}}
            placeholder="Enter text here..."
          />
          <View style={{height: 72}} />
          <Pressable
            onPress={() => {
              const data = {
                radius: 34,
                timeAfterResume: 1000,
              };
              console.log('blur view');
              ScreenGuardModule.registerWithBlurView(data);
              setCurrentState(() => '5');
            }}>
            <Text
              style={{
                color: currentState === '5' ? '#00FF00' : Colors.white,
              }}>
              Turn on screenguard with blur radius = 35
            </Text>
          </Pressable>
          <View style={{height: 72}} />
          <Pressable
            onPress={() => {
              ScreenGuardModule.registerWithImage({
                height: 150,
                width: 200,
                top: 0,
                bottom: 120,
                left: 180,
                source: {
                  uri: 'https://www.icegif.com/wp-content/uploads/2022/09/icegif-386.gif',
                },
                alignment: ScreenGuardConstants.Alignment.topCenter,
                defaultSource: require('./images/ahihi.jpg'),
                timeAfterResume: 2000,
                backgroundColor: color,
              });
              console.log('image view');
              setCurrentState('6');
            }}>
            <Text
              style={{
                color: currentState === '6' ? '#00FF00' : Colors.white,
              }}>
              Turn on screenguard with Image
            </Text>
          </Pressable>
          <View style={{height: 72}} />
          <Pressable
            onPress={() => {
              ScreenGuardModule.registerWithoutEffect();
              console.log('Android only');
              setCurrentState('7');
            }}>
            <Text
              style={{
                color: currentState === '7' ? '#00FF00' : Colors.white,
              }}>
              Turn on screenguard (android only)
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#F194FF',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
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
