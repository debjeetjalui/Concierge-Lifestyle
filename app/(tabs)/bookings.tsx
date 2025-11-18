import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookings } from '@/hooks/useBookings';
import { router } from 'expo-router';

const handleExperiencePress = (experienceId: string) => {
  router.push({
    pathname: '/experience/[id]',
    params: { id: experienceId }
  });
};

export default function BookingsScreen() {
  const { upcomingBookings, pastBookings, loading, cancelBooking } = useBookings();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleCancelBooking = (bookingId: string, experienceTitle: string) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking for ${experienceTitle}?`,
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: () => cancelBooking(bookingId)
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Manage your experiences</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Upcoming Bookings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366F1" />
            </View>
          ) : upcomingBookings.length > 0 ? (
            <View style={styles.bookingsList}>
              {upcomingBookings.map((booking) => (
                <TouchableOpacity key={booking.id} style={styles.bookingCard}>
                  <Image source={{ uri: booking.experience?.image }} style={styles.bookingImage} />
                  
                  <View style={styles.bookingContent}>
                    <View style={styles.bookingHeader}>
                      <View style={styles.bookingInfo}>
                        <Text style={styles.bookingTitle}>{booking.experience?.title}</Text>
                        <Text style={styles.bookingType}>{booking.experience?.category}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}>
                        <Text style={[styles.statusText, { color: '#059669' }]}>
                          {booking.status}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.bookingDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{booking.time}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{booking.experience?.location}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Guests:</Text>
                        <Text style={styles.detailText}>{booking.guests}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.bookingActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleCancelBooking(booking.id, booking.experience?.title || '')}
                      >
                        <Ionicons name="close" size={16} color="#EF4444" />
                        <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
                        <Text style={styles.primaryActionText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No upcoming bookings</Text>
              <Text style={styles.emptyStateSubtitle}>
                Explore amazing experiences and make your first reservation
              </Text>
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => router.push('/(tabs)/explore')}
              >
                <Text style={styles.exploreButtonText}>Explore Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Past Bookings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Experiences</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366F1" />
            </View>
          ) : pastBookings.length > 0 ? (
            <View style={styles.bookingsList}>
              {pastBookings.map((booking) => (
                <TouchableOpacity key={booking.id} style={styles.bookingCard}>
                  <Image source={{ uri: booking.experience?.image }} style={styles.bookingImage} />
                  
                  <View style={styles.bookingContent}>
                    <View style={styles.bookingHeader}>
                      <View style={styles.bookingInfo}>
                        <Text style={styles.bookingTitle}>{booking.experience?.title}</Text>
                        <Text style={styles.bookingType}>{booking.experience?.category}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: '#F3F4F6' }]}>
                        <Text style={[styles.statusText, { color: '#6B7280' }]}>
                          {booking.status}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.bookingDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{booking.time}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{booking.experience?.location}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.bookingActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleExperiencePress(booking.experience_id)}
                      >
                        <Text style={styles.actionButtonText}>Book Again</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Write Review</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No past bookings</Text>
              <Text style={styles.emptyStateSubtitle}>
                Your completed experiences will appear here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  bookingsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  bookingImage: {
    width: '100%',
    height: 120,
  },
  bookingContent: {
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookingType: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDetails: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: {
    fontSize: 16,
    color: '#D1D5DB',
  },
  starFilled: {
    color: '#F59E0B',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
  },
  primaryAction: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  exploreButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
});