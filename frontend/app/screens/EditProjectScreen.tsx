import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the close icon
import { supabase } from '@/app/lib/supabse';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';

export default function EditProjectScreen(){
  const { projectId } = useLocalSearchParams(); // Get the project ID from navigation params
  console.log("projectId:", projectId);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeline, setTimeline] = useState('');
  const [projectStatus, setprojectStatus] = useState('');
  const [paymentDetails, setpaymentDetails] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null); // Store initial data for comparison

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('project_id', projectId)
          .single();

        if (error) {
          console.error('Error fetching project details:', error.message);
          Alert.alert('Error', 'Failed to fetch project details.');
          return;
        }

        // Set all fields from the fetched project data
        setTitle(data.project_title);
        setDescription(data.description);
        setTimeline(data.timeline);
        setprojectStatus(data.project_status);
        setpaymentDetails(data.payment_details);
        setSkills(data.skills);
        setLocation(data.location);

        setInitialData(data); // Store initial data for comparison
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    if (!initialData) return false; // No initial data yet

    return (
      title !== initialData.title ||
      description !== initialData.description ||
      timeline !== initialData.timeline ||
      paymentDetails !== initialData.paymentDetails ||
      projectStatus !== initialData.projectStatus ||
      skills !== initialData.skills ||
      location !== initialData.location
    );
  };

  // Handle back button press (hardware or cancel button)
  const onBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        'Are you sure?',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
      return true; // Prevent default behavior (going back)
    } else {
      router.back(); // Explicitly navigate back if there are no unsaved changes
      return false; // Allow default behavior (going back)
    }
  };

  // Add event listener for hardware back button
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [onBackPress])
  );

  // Save updated project details
  const handleSave = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Title and Description are required.');
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          project_title: title,
          description,
          timeline,
          payment_details: paymentDetails,
          skills,
          location,
          project_status: projectStatus,
        })
        .eq('project_id', projectId);

      if (error) {
        console.error('Error updating project:', error.message);
        Alert.alert('Error', 'Failed to update project.');
        return;
      }

      Alert.alert('Success', 'Project updated successfully.');
      router.back(); // Go back to the previous screen
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()} // Dismiss keyboard if open}
    >
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexContainer}
      >
        <ScrollView style={styles.scrollContainer}>
          {/* Cancel Button */}
          <TouchableOpacity onPress={onBackPress} style={styles.cancelButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.title}>Edit Project</Text>

          {/* Project Title */}
          <TextInput
            placeholder="Project Title"
            placeholderTextColor="#E53935" // Red for required fields
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          {/* Description */}
          <TextInput
            placeholder="Project Description"
            placeholderTextColor="#E53935" // Red for required fields
            value={description}
            onChangeText={setDescription}
            multiline
            style={[styles.input, styles.descriptionInput]}
          />

          {/* Timeline */}
          <TextInput
            placeholder="Timeline"
            placeholderTextColor="#888" // Light gray for optional fields
            value={timeline}
            onChangeText={setTimeline}
            style={styles.input}
          />

          {/* Payment Details */}
          <TextInput
            placeholder="Payment Details"
            placeholderTextColor="#888" // Light gray for optional fields
            value={paymentDetails}
            onChangeText={setpaymentDetails}
            style={styles.input}
          />

          {/* Skills */}
          <TextInput
            placeholder="Skills)"
            placeholderTextColor="#888" // Light gray for optional fields
            value={skills}
            onChangeText={setSkills}
            style={styles.input}
          />

          {/* Location */}
          <TextInput
            placeholder="Location"
            placeholderTextColor="#888" // Light gray for optional fields
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />

          {/* Project Status */}
          <TextInput
            placeholder="Project Status"
            placeholderTextColor="#888" // Light gray for optional fields
            value={projectStatus}
            onChangeText={setprojectStatus}
            style={styles.input}
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.editButton} onPress={handleSave}>
            <Text style={styles.editButtonText}>Save changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flexContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  cancelButton: {
    position: 'absolute',
    top: 2,
    right: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top', // Ensures text starts from the top
  },
  editButton: {
    backgroundColor: '#2C3036',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 50,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});