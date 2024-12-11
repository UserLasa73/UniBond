iimport React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

const GetStartedPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image
        source={require('./assets/uniBond-01 1.png')}
        style={styles.logo}
      />
      
      {/* Welcome Text */}
      <Text style={styles.title}>Uni Bond</Text>
      
      {/* Get Started Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GetStartedPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF', 
    padding: 20,
  },
  logo: {
    width: 400, 
    height: 400, 
    marginBottom: 40, 
    resizeMode: 'contain', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFF', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});
