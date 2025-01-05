import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../models';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  route: RouteProp<RootStackParamList, 'ShowerDetails'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'ShowerDetails'>;
};

type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

const SHOWER_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'John M.',
    rating: 5,
    text: 'The walk-in shower transformed our bathroom completely. Installation was quick and professional.',
    date: '2024-02-15',
  },
  {
    id: '2',
    author: 'Sarah L.',
    rating: 5,
    text: 'Perfect for my elderly mother. The non-slip floor and grab bars make it very safe.',
    date: '2024-01-30',
  },
  {
    id: '3',
    author: 'Robert K.',
    rating: 4,
    text: 'Great quality and design. Would recommend to anyone looking for an accessible shower solution.',
    date: '2024-01-20',
  },
];

const ReviewStars: React.FC<{ rating: number }> = ({ rating }) => (
  <View style={styles.starsContainer}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Ionicons
        key={star}
        name={star <= rating ? 'star' : 'star-outline'}
        size={16}
        color="#FFB800"
      />
    ))}
  </View>
);

export const ShowerDetails: React.FC<Props> = ({ route }) => {
  const { zipCode } = route.params;

  const renderReview = (review: typeof SHOWER_REVIEWS[number]) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewAuthor}>{review.author}</Text>
        <ReviewStars rating={review.rating} />
      </View>
      <Text style={styles.reviewText}>{review.text}</Text>
      <Text style={styles.reviewDate}>
        {new Date(review.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Walk-in Showers</Text>
        <Text style={styles.description}>
          Transform your bathroom with a modern, accessible walk-in shower. Our solutions combine 
          safety, comfort, and elegant design to create the perfect showering experience for all ages 
          and mobility levels.
        </Text>

        <Text style={styles.sectionTitle}>Key Features:</Text>
        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>• Low or zero threshold entry</Text>
          <Text style={styles.featureItem}>• Non-slip flooring options</Text>
          <Text style={styles.featureItem}>• Built-in seating available</Text>
          <Text style={styles.featureItem}>• Grab bars for added safety</Text>
          <Text style={styles.featureItem}>• Custom glass enclosures</Text>
          <Text style={styles.featureItem}>• Multiple shower head options</Text>
        </View>

        <Text style={styles.sectionTitle}>Installation Process:</Text>
        <View style={styles.processList}>
          <Text style={styles.processItem}>1. Free in-home consultation</Text>
          <Text style={styles.processItem}>2. Custom design and measurements</Text>
          <Text style={styles.processItem}>3. Professional installation</Text>
          <Text style={styles.processItem}>4. Quality inspection</Text>
        </View>

        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        <View style={styles.reviewsContainer}>
          {SHOWER_REVIEWS.map(renderReview)}
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaText}>
            Ready to upgrade your bathroom? Schedule a free consultation in {zipCode}.
          </Text>
          <Button variant="primary" onPress={() => {}}>
            Schedule Free Consultation
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 24,
  },
  processList: {
    marginBottom: 32,
  },
  processItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 24,
  },
  ctaSection: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  ctaText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  reviewsContainer: {
    marginBottom: 32,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
}); 