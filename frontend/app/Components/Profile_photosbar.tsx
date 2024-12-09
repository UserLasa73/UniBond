import { View, Image, StyleSheet } from 'react-native';

export default function Draft(){
  return (
    <View style={styles.container}>
      {/* Cover photo */}
      <Image
        source={{ uri: 'https://via.placeholder.com/600x150' }}
        style={styles.coverPhoto}
      />

      {/* Profile photo */}
      <View style={styles.profilePhotoContainer}>
        <View style={styles.profilePhotoBorder}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profilePhoto}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverPhoto: {
    width: '100%',
    height: 200,
  },
  profilePhotoContainer: {
    alignItems: 'flex-start',
    marginTop: -50,
    marginLeft: 16,
  },
  profilePhotoBorder: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});