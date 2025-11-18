import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useExperiences } from '@/hooks/useExperiences';
import { useFavorites } from '@/hooks/useFavorites';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const categories = [
  { name: 'Dining', icon: 'restaurant-outline', color: '#6366F1' },
  { name: 'Wellness', icon: 'leaf-outline', color: '#10B981' },
  { name: 'Entertainment', icon: 'musical-notes-outline', color: '#F59E0B' },
  { name: 'Shopping', icon: 'bag-outline', color: '#EF4444' },
];

export default function HomeScreen() {
  const { profile, signOut } = useAuth();
  const { experiences, loading } = useExperiences();
  const { toggleFavorite, isFavorite } = useFavorites();

  const featuredExperiences = experiences.slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: '/(tabs)/explore',
      params: { category: categoryName }
    });
  };

  const handleExperiencePress = (experienceId: string) => {
    router.push({
      pathname: '/experience/[id]',
      params: { id: experienceId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{profile?.full_name || 'Guest'}</Text>
          </View>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Ionicons name="log-out-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Indulge in Life's</Text>
          <Text style={styles.heroSubtitle}>Finest Moments</Text>
          <Text style={styles.heroDescription}>
            Discover curated experiences that elevate your lifestyle
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.categoryCard, { borderLeftColor: category.color }]}
                onPress={() => handleCategoryPress(category.name)}
              >
                <Ionicons name={category.icon as any} size={24} color={category.color} style={styles.categoryIcon} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Experiences */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Experiences</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366F1" />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
              {featuredExperiences.map((experience) => (
                <TouchableOpacity 
                  key={experience.id} 
                  style={styles.experienceCard}
                  onPress={() => handleExperiencePress(experience.id)}
                >
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: experience.image }} style={styles.experienceImage} />
                    <TouchableOpacity 
                      style={styles.favoriteButton}
                      onPress={() => toggleFavorite(experience.id)}
                    >
                      <Ionicons 
                        name={isFavorite(experience.id) ? "heart" : "heart-outline"}
                        size={16} 
                        color="#FFFFFF" 
                      />
                    </TouchableOpacity>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{experience.category}</Text>
                    </View>
                  </View>
                
                  <View style={styles.experienceContent}>
                    <Text style={styles.experienceTitle}>{experience.title}</Text>
                    <View style={styles.experienceDetails}>
                      <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                        <Text style={styles.locationText}>{experience.location}</Text>
                      </View>
                      <Text style={styles.priceText}>{experience.price}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.ratingText}>{experience.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Ionicons name="phone-portrait-outline" size={32} color="#6366F1" />
              <Text style={styles.quickActionTitle}>Book Now</Text>
              <Text style={styles.quickActionSubtitle}>Instant reservations</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Ionicons name="gift-outline" size={32} color="#6366F1" />
              <Text style={styles.quickActionTitle}>Gift Cards</Text>
              <Text style={styles.quickActionSubtitle}>Perfect for someone special</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 2,
  },
  signOutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
    lineHeight: 38,
  },
  heroDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 24,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    width: (width - 52) / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  featuredSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  featuredScroll: {
    paddingLeft: 20,
  },
  experienceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  experienceImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 8,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  experienceContent: {
    padding: 16,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  experienceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});