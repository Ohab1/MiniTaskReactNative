// authStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: '5%',
    backgroundColor: 'white',
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop: '25%',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop: '25%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
  },
  input: {
    width: '100%',
    marginBottom: 18,
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: 'purple',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 25,
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  signupText: {
    marginTop: 15,
    color: '#666',
  },
  loginText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#666',
  }
});




export default styles;
