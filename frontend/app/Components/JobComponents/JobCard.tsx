import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface JobCardProps {
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
    avatar_url?: string | null;  //allow undefined
    full_name?: string;  //allow undefined
    image_url: string | null;
    created_at: string;
    expandedJobId: string | null;
    jobId: string;
    savedJobs: string[];
    onSaveJob: (jobId: string) => void;
    toggleExpand: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({
    title,
    company,
    location,
    type,
    skills,
    deadline,
    job_phone,
    job_email,
    job_website,
    description,
    avatar_url,
    full_name,
    image_url,
    created_at,
    expandedJobId,
    jobId,
    savedJobs,
    onSaveJob,
    toggleExpand,
}) => {
    const getRelativeTime = (createdAt: string) => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} day ago`;
        return new Date(createdAt).toLocaleDateString();
    };

    return (
        <View style={styles.container}>
            {/* Profile Image and Name */}
            <View style={styles.profileContainer}>
                {avatar_url ? (
                    <Image source={{ uri: avatar_url }} style={styles.avatar} />
                ) : (
                    <Ionicons name="person-circle" size={40} color="gray" />
                )}
                <View>
                    <Text style={styles.name}>{full_name}</Text>
                    <Text style={styles.date}>{getRelativeTime(created_at)}</Text>
                </View>
            </View>

            <View style={styles.card}>
                {/* Job Details */}
                <Text style={styles.title}>{title}</Text>
                {company && <Text style={styles.company}>at {company}</Text>}

                {image_url && <Image source={{ uri: image_url }} style={styles.image} />}

                <View style={styles.details}>
                    {location && (
                        <View style={styles.row}>
                            <MaterialIcons name="location-on" size={20} color="gray" />
                            <Text style={styles.detailText}>Location: {location}</Text>
                        </View>
                    )}
                    {type && (
                        <View style={styles.row}>
                            <Ionicons name="briefcase-outline" size={20} color="gray" />
                            <Text style={styles.detailText}>Type: {type}</Text>
                        </View>
                    )}
                    {skills && (
                        <View style={styles.row}>
                            <MaterialIcons name="article" size={20} color="gray" />
                            <Text style={styles.detailText}>Skills: {skills}</Text>
                        </View>
                    )}
                    {deadline && (
                        <View style={styles.row}>
                            <MaterialIcons name="event" size={20} color="gray" />
                            <Text style={styles.detailText}>Deadline: {deadline}</Text>
                        </View>
                    )}
                    {(job_phone || job_email || job_website) && (
                        <View style={styles.row}>
                            <MaterialIcons name="person" size={20} color="gray" />
                            <Text style={styles.detailText}>
                                Contact: {job_phone} | {job_email} | {job_website}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Description */}
                {description && (
                    <View>
                        {expandedJobId === jobId ? (
                            <Text style={styles.description}>{description}</Text>
                        ) : (
                            <TouchableOpacity onPress={() => toggleExpand(jobId)} style={styles.readMoreButton}>
                                <Text style={styles.readMoreText}>Read More</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {expandedJobId === jobId && description && (
                    <TouchableOpacity onPress={() => toggleExpand(jobId)} style={styles.readMoreButton}>
                        <Text style={styles.readMoreText}>Read Less</Text>
                    </TouchableOpacity>
                )}

                {/* Save Job Button */}
                <View style={styles.buttonGroup}>
                    <TouchableOpacity onPress={() => onSaveJob(jobId)} style={styles.iconButton}>
                        <Ionicons name={savedJobs.includes(jobId) ? "bookmark" : "bookmark-outline"} size={30} color="#000" />
                    </TouchableOpacity>

                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginHorizontal: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    date: {
        fontSize: 12,
        color: 'gray',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    company: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 15,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
        marginBottom: 10,
    },
    details: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 14,
        color: 'gray',
    },
    description: {
        fontSize: 14,
        color: 'gray',
    },
    readMoreButton: {
        marginVertical: 8,
        alignSelf: 'flex-start',
    },
    readMoreText: {
        fontSize: 14,
        color: '#007BFF',
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    iconButton: {
        padding: 6,
        borderRadius: 50,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default JobCard;
