import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Profile_description(){
  return (
    <View style={styles.container}>
      {/* User Info */}
      <Text style={styles.name}>Aathif Ahamed</Text>
      <Text style={styles.title}>Product Designer</Text>
      <Text style={styles.university}>University of Vavuniya</Text>
      <Text style={styles.location}>Vavuniya</Text>
      <Text style={styles.followers}>636 followers</Text>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.buttonText}>More</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <Text style={styles.aboutHeading}>About</Text>
      <Text style={styles.aboutText}>
        UX Designer at Google, Product Design Enthusiast...
      </Text>

      {/* Manage Network */}
      <TouchableOpacity>
        <Text style={styles.manageNetwork}>Manage my network</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 260,
    padding: 16,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  university: {
    fontSize: 14,
    color: '#555',
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  followers: {
    fontSize: 14,
    color: '#000',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  moreButton: {
    backgroundColor: '#000',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  aboutHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aboutText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  manageNetwork: {
    fontSize: 14,
    color: '#0073e6',
  },
});