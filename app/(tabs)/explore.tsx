import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useSearchExperiences } from '@/hooks/useExperiences';
import { useFavorites } from '@/hooks/useFavorites';
import { router, useLocalSearchParams } from 'expo-router';


const filterCategories = ['All', 'Dining', 'Wellness', 'Entertainment', 'Shopping', 'Nightlife'];

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(params.category as string || 'All');
  const { experiences, loading } = useSearchExperiences(searchQuery, selectedCategory);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category as string);
    }
  }, [params.category]);

  const handleExperiencePress = (experienceId: string) => {
    router.push({
      pathname: '/experience/[id]',
      params: { id: experienceId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Discover amazing experiences near you</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search experiences..."
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Filter Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {filterCategories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.categoryFilter,
                category === selectedCategory && styles.categoryFilterActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryFilterText,
                category === selectedCategory && styles.categoryFilterTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>{experiences.length} experiences found</Text>
          <TouchableOpacity>
            <Text style={styles.sortText}>Sort by: Popular</Text>
          </TouchableOpacity>
        </View>

        {/* Experience Cards */}
        <View style={styles.experiencesList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366F1" />
              <Text style={styles.loadingText}>Finding amazing experiences...</Text>
            </View>
          ) : experiences.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No experiences found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or category filter</Text>
            </View>
          ) : (
            experiences.map((experience) => (
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
                </View>
                
                <View style={styles.experienceContent}>
                  <View style={styles.experienceHeader}>
                    <View style={styles.experienceInfo}>
                      <Text style={styles.experienceTitle}>{experience.title}</Text>
                      <Text style={styles.experienceCategory}>{experience.category}</Text>
                    </View>
                    <Text style={styles.experiencePrice}>{experience.price}</Text>
                  </View>
                
                  <Text style={styles.experienceDescription}>{experience.description}</Text>
                
                  <View style={styles.experienceFooter}>
                    <View style={styles.locationContainer}>
                      <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                      <Text style={styles.locationText}>{experience.location}</Text>
                    </View>
                  
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text style={styles.ratingText}>{experience.rating}</Text>
                      <Text style={styles.reviewsText}>({experience.reviews})</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryFilter: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryFilterActive: {
    backgroundColor: '#6366F1',
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryFilterTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  sortText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  experiencesList: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 20,
  },
  experienceCard: {
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
  experienceImage: {
    width: '100%',
    height: 160,
  },
  experienceContent: {
    padding: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  experienceInfo: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  experienceCategory: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  experiencePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  experienceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  experienceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewsText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  imageContainer: {
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 8,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});