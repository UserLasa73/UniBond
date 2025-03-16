import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import JobCard from './JobCard';
import { supabase } from '@/app/lib/supabse'; // Assuming this path
import { deleteJob } from './DeleteFunction'; // Import the delete function

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  skills: string;
  deadline: string;
  job_phone: string;
  job_email: string;
  job_website: string;
  description: string;
  avatar_url: string | null;
  full_name: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
}

const AvailableJobs: React.FC = () => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false); // Separate state for loading more jobs

  // Add these new state variables for infinite scrolling
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMoreJobs, setHasMoreJobs] = useState<boolean>(true);

  // Fetch jobs with pagination
  const fetchJobs = async (page: number, pageSize: number = 10) => {
    try {
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1); // Fetch a specific range of jobs

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError.message);
        return;
      }

      // Fetch profiles and map them to jobs (same as before)
      const userIds = jobs.map((job) => job.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError.message);
        return;
      }

      const SUPABASE_STORAGE_URL = 'https://jnqvgrycauzjnvepqorq.supabase.co/storage/v1/object/public/';

      const jobsWithProfiles = jobs.map((job) => {
        const profile = profiles.find((p) => p.id === job.user_id);
        return {
          ...job,
          avatar_url: profile?.avatar_url ? `${SUPABASE_STORAGE_URL}avatars/${profile.avatar_url}` : null,
          full_name: profile?.full_name || 'Unknown',
          image_url: job.image_url ? `${SUPABASE_STORAGE_URL}job_Images/${job.image_url}` : null,
        };
      });

      return jobsWithProfiles;
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  // Load more jobs for infinite scrolling
  const loadMoreJobs = async () => {
    if (!hasMoreJobs || isLoadingMore) return;

    setIsLoadingMore(true); // Set loading state for "load more"

    const nextPage = currentPage + 1;
    const newJobs = await fetchJobs(nextPage);

    if (newJobs && newJobs.length > 0) {
      setJobListings((prevJobs) => [...prevJobs, ...newJobs]); // Append new jobs to the end
      setCurrentPage(nextPage);
    } else {
      setHasMoreJobs(false); // No more jobs to load
    }

    setIsLoadingMore(false); // Reset loading state
  };

  // Fetch initial jobs and user info
  useEffect(() => {
    const loadInitialJobs = async () => {
      setIsLoading(true);
      const jobs = await fetchJobs(1);
      if (jobs) {
        setJobListings(jobs);
      }
      setIsLoading(false);
    };

    const getUserAndSavedJobs = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError.message);
        return;
      }
      setUser(userData?.user);

      if (userData?.user) {
        const { data: savedJobs, error: savedJobsError } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', userData.user.id);

        if (savedJobsError) {
          console.error('Error fetching saved jobs:', savedJobsError.message);
        } else {
          setSavedJobIds(savedJobs.map((job) => job.job_id)); // Store saved job IDs
        }
      }
    };

    loadInitialJobs();
    getUserAndSavedJobs();
  }, []);

  // Toggle the expand state of a job description
  const toggleExpand = (id: string) => {
    setExpandedJobId((prevId) => (prevId === id ? null : id));
  };

  // Save or unsave a job
  const saveJob = async (jobId: string) => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to save jobs.');
      return;
    }

    try {
      if (savedJobIds.includes(jobId)) {
        // Remove job from saved_jobs
        const { error } = await supabase.from('saved_jobs').delete().eq('user_id', user.id).eq('job_id', jobId);

        if (error) {
          console.error('Error unsaving job:', error.message);
          Alert.alert('Error', 'Failed to remove job.');
        } else {
          setSavedJobIds((prev) => prev.filter((id) => id !== jobId)); // Update state
          Alert.alert('Unsaved', 'The job has been unsaved successfully.');
        }
      } else {
        // Save job to saved_jobs
        const { error } = await supabase.from('saved_jobs').insert([{ user_id: user.id, job_id: jobId }]);

        if (error) {
          console.error('Error saving job:', error.message);
          Alert.alert('Error', 'Failed to save job.');
        } else {
          setSavedJobIds((prev) => [...prev, jobId]); // Update state
          Alert.alert('Saved', 'The job has been saved successfully.');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={jobListings}
          renderItem={({ item }) => (
            <JobCard
              {...item}
              expandedJobId={expandedJobId}
              jobId={item.id}
              savedJobs={savedJobIds}
              onSaveJob={saveJob}
              toggleExpand={toggleExpand}
              currentUserId={user?.id}
              onDeleteJob={() => deleteJob(item.id, item.image_url, setJobListings)}
            />
          )}
          keyExtractor={(item) => item.id} // Ensure each item has a unique key
          onEndReached={loadMoreJobs} // Trigger loading more jobs
          onEndReachedThreshold={0.5} // Load more jobs when 50% of the list is reached
          ListFooterComponent={
            isLoadingMore ? ( // Show loading indicator at the bottom when loading more jobs
              <ActivityIndicator size="large" color="#0000ff" />
            ) : null
          }
        />
      )}
    </View>
  );
};

export default AvailableJobs;