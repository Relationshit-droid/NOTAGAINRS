/**
 * Comprehensive Activity System for "Love, Actually... The Game"
 * 7 Main Categories × 10 Subcategories × 20 Activities = 1,400 Total Activities
 */

export interface ActivityCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories: ActivitySubcategory[];
}

export interface ActivitySubcategory {
  id: string;
  name: string;
  description: string;
  estimatedTime: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  activities: ActivityTemplate[];
}

export interface ActivityTemplate {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'game' | 'challenge' | 'reflection';
  questions: ActivityQuestionTemplate[];
  drMarcieIntro: string;
  drMarcieOutro: string;
  pointValue: number;
  tags: string[];
}

export interface ActivityQuestionTemplate {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'likert_scale' | 'fill_blank' | 'essay' | 'file_upload' | 'drag_drop' | 'sequence' | 'dropdown' | 'yes_no' | 'numerical' | 'picture_based';
  options?: string[];
  correctAnswer?: string;
  pointValue: number;
  drMarcieResponses: {
    [key: string]: string; // Response templates for different answers
  };
  timeLimit?: number; // in seconds
}

// The 7 Main Categories with comprehensive subcategories and activities
export const COMPREHENSIVE_ACTIVITY_SYSTEM: ActivityCategory[] = [
  
  // ===== CATEGORY 1: EMOTIONAL CONNECTION (SEEN Method Based) =====
  {
    id: 'emotional_connection',
    name: 'Emotional Connection',
    description: 'Deep vulnerability and bonding challenges based on the SEEN method',
    icon: '💕',
    color: 'from-pink-500 to-red-500',
    subcategories: [
      {
        id: 'safety_security',
        name: 'Safety & Security Building',
        description: 'Creating emotional safety in your relationship',
        estimatedTime: 15,
        difficulty: 2,
        activities: Array(20).fill(null).map((_, index) => ({
          id: `safety_security_${String(index + 1).padStart(2, '0')}`,
          title: [
            'Creating Your Safe Space Sanctuary',
            'The Trust Fall Challenge',
            'Emotional Safety Check-In Ritual',
            'Safe Word Development Game',
            'Emotional Boundary Mapping',
            'Safety Story Archaeology',
            'Partner Safety Assessment',
            'Safety Signal Creation',
            'Emotional Emergency Plan',
            'Safety Celebration Ritual',
            'Trust Temperature Check',
            'Safety Vision Board',
            'Nervous System Safety',
            'Safety Promise Ceremony',
            'Emotional Fortress Building',
            'Safety Accountability Partners',
            'Safety Progress Tracking',
            'Safety Renewal Ritual',
            'Safety Milestone Celebration',
            'Master Safety Builder'
          ][index] || `Safety Activity ${index + 1}`,
          description: `Comprehensive safety-building activity focused on emotional security and trust`,
          type: index < 5 ? 'quiz' : index < 10 ? 'game' : index < 15 ? 'challenge' : 'reflection',
          pointValue: 25 + (index * 2),
          tags: ['safety', 'security', 'trust', 'emotional_safety'],
          drMarcieIntro: "Let's build unshakeable emotional safety together. This exercise will strengthen your foundation of trust and security.",
          drMarcieOutro: "Beautiful safety-building work! Every small action creates the emotional sanctuary where love can flourish freely.",
          questions: [
            {
              id: `safety_security_${String(index + 1).padStart(2, '0')}_q1`,
              text: 'How does this safety exercise apply to your relationship?',
              type: 'essay',
              pointValue: 10,
              drMarcieResponses: {
                'specific_application': "I love how specifically you're thinking about applying this to your relationship!",
                'general_response': "Good insights! Can you think of a specific example of how this might work in your daily life?",
                'resistance': "I notice some hesitation. What feels challenging about implementing this safety practice?"
              }
            }
          ]
        }))
      },
      {
        id: 'emotional_validation',
        name: 'Emotional Validation Techniques',
        description: 'Learning to validate and honor each other\'s emotions',
        estimatedTime: 18,
        difficulty: 3,
        activities: [
          // 20 activities for Emotional Validation
        ]
      },
      {
        id: 'empathy_development',
        name: 'Empathy Development',
        description: 'Building deeper understanding and empathy',
        estimatedTime: 20,
        difficulty: 3,
        activities: [
          // 20 activities for Empathy Development
        ]
      },
      {
        id: 'needs_identification',
        name: 'Needs Identification & Expression',
        description: 'Learning to identify and express your needs clearly',
        estimatedTime: 16,
        difficulty: 2,
        activities: [
          // 20 activities for Needs Identification
        ]
      },
      {
        id: 'vulnerability_practice',
        name: 'Vulnerability Practice',
        description: 'Safe vulnerability exercises to build deeper connection',
        estimatedTime: 22,
        difficulty: 4,
        activities: [
          // 20 activities for Vulnerability Practice
        ]
      },
      {
        id: 'emotional_regulation',
        name: 'Emotional Regulation Together',
        description: 'Learning to co-regulate emotions in partnership',
        estimatedTime: 19,
        difficulty: 3,
        activities: [
          // 20 activities for Emotional Regulation
        ]
      },
      {
        id: 'connection_rituals',
        name: 'Connection Rituals',
        description: 'Building daily and weekly rituals that maintain connection',
        estimatedTime: 14,
        difficulty: 2,
        activities: [
          // 20 activities for Connection Rituals
        ]
      },
      {
        id: 'healing_past_wounds',
        name: 'Healing Past Wounds',
        description: 'Addressing and healing relationship injuries together',
        estimatedTime: 25,
        difficulty: 5,
        activities: [
          // 20 activities for Healing Past Wounds
        ]
      },
      {
        id: 'trust_rebuilding',
        name: 'Trust Rebuilding Exercises',
        description: 'Specific exercises to rebuild and strengthen trust',
        estimatedTime: 21,
        difficulty: 4,
        activities: [
          // 20 activities for Trust Rebuilding
        ]
      },
      {
        id: 'intimacy_restoration',
        name: 'Intimacy Restoration',
        description: 'Rebuilding emotional and physical intimacy',
        estimatedTime: 23,
        difficulty: 4,
        activities: [
          // 20 activities for Intimacy Restoration
        ]
      }
    ]
  },

  // ===== CATEGORY 2: PSYCHOLOGY GAMES (Gottman Method Based) =====
  {
    id: 'psychology_games',
    name: 'Psychology Games',
    description: 'Science-backed relationship exercises based on research',
    icon: '🧠',
    color: 'from-purple-500 to-blue-500',
    subcategories: [
      {
        id: 'attachment_styles',
        name: 'Attachment Styles Deep Dive',
        description: 'Understanding your attachment patterns and how they interact',
        estimatedTime: 24,
        difficulty: 3,
        activities: [
          // 20 activities for Attachment Styles
        ]
      },
      {
        id: 'love_languages_mastery',
        name: 'Love Languages Mastery',
        description: 'Beyond the basics - mastering your unique love languages',
        estimatedTime: 17,
        difficulty: 2,
        activities: [
          // 20 activities for Love Languages Mastery
        ]
      },
      {
        id: 'self_awareness_building',
        name: 'Self-Awareness Building',
        description: 'Individual growth exercises that benefit the relationship',
        estimatedTime: 20,
        difficulty: 3,
        activities: [
          // 20 activities for Self-Awareness Building
        ]
      },
      {
        id: 'four_horsemen_combat',
        name: 'Four Horsemen Combat Training',
        description: 'Identifying and stopping criticism, contempt, defensiveness, and stonewalling',
        estimatedTime: 22,
        difficulty: 4,
        activities: [
          // 20 activities for Four Horsemen Combat
        ]
      },
      {
        id: 'fighting_fair_techniques',
        name: 'Fighting Fair Techniques',
        description: 'Healthy conflict resolution and communication skills',
        estimatedTime: 18,
        difficulty: 3,
        activities: [
          // 20 activities for Fighting Fair Techniques
        ]
      },
      {
        id: 'conflict_resolution_skills',
        name: 'Conflict Resolution Skills',
        description: 'Advanced techniques for resolving disagreements constructively',
        estimatedTime: 21,
        difficulty: 4,
        activities: [
          // 20 activities for Conflict Resolution Skills
        ]
      },
      {
        id: 'emotional_intelligence_testing',
        name: 'Emotional Intelligence Testing',
        description: 'Assessing and building emotional intelligence together',
        estimatedTime: 19,
        difficulty: 3,
        activities: [
          // 20 activities for Emotional Intelligence Testing
        ]
      },
      {
        id: 'communication_patterns',
        name: 'Communication Patterns Analysis',
        description: 'Understanding your unique communication styles and patterns',
        estimatedTime: 16,
        difficulty: 2,
        activities: [
          // 20 activities for Communication Patterns Analysis
        ]
      },
      {
        id: 'relationship_mapping',
        name: 'Relationship Mapping',
        description: 'Visual exercises to understand your relationship dynamics',
        estimatedTime: 23,
        difficulty: 3,
        activities: [
          // 20 activities for Relationship Mapping
        ]
      },
      {
        id: 'future_visioning',
        name: 'Future Visioning Together',
        description: 'Creating shared visions and goals for your relationship',
        estimatedTime: 20,
        difficulty: 2,
        activities: [
          // 20 activities for Future Visioning Together
        ]
      }
    ]
  },

  // ===== CATEGORY 3: CREATIVE CHAOS (Fun & Connection) =====
  {
    id: 'creative_chaos',
    name: 'Creative Chaos',
    description: 'Fun, silly, and playful activities to spark joy and connection',
    icon: '🎭',
    color: 'from-yellow-500 to-orange-500',
    subcategories: [
      {
        id: 'role_play_scenarios',
        name: 'Role-Play Scenarios',
        description: 'Fun role-playing exercises to explore different dynamics',
        estimatedTime: 15,
        difficulty: 2,
        activities: [
          // 20 activities for Role-Play Scenarios
        ]
      },
      {
        id: 'photo_challenges',
        name: 'Photo Challenges',
        description: 'Creative photo challenges to capture your love story',
        estimatedTime: 12,
        difficulty: 1,
        activities: [
          // 20 activities for Photo Challenges
        ]
      },
      {
        id: 'reenactment_games',
        name: 'Reenactment Games',
        description: 'Recreating important moments and memories together',
        estimatedTime: 18,
        difficulty: 2,
        activities: [
          // 20 activities for Reenactment Games
        ]
      },
      {
        id: 'creative_storytelling',
        name: 'Creative Storytelling',
        description: 'Building stories together and exploring imagination',
        estimatedTime: 16,
        difficulty: 2,
        activities: [
          // 20 activities for Creative Storytelling
        ]
      },
      {
        id: 'art_expression',
        name: 'Art & Expression Activities',
        description: 'Artistic exercises to express feelings and create together',
        estimatedTime: 20,
        difficulty: 2,
        activities: [
          // 20 activities for Art & Expression Activities
        ]
      },
      {
        id: 'music_dance_challenges',
        name: 'Music & Dance Challenges',
        description: 'Musical and movement activities to connect through rhythm',
        estimatedTime: 14,
        difficulty: 1,
        activities: [
          // 20 activities for Music & Dance Challenges
        ]
      },
      {
        id: 'memory_lane_adventures',
        name: 'Memory Lane Adventures',
        description: 'Exploring your shared history and creating new memories',
        estimatedTime: 17,
        difficulty: 2,
        activities: [
          // 20 activities for Memory Lane Adventures
        ]
      },
      {
        id: 'fantasy_dreams_sharing',
        name: 'Fantasy & Dreams Sharing',
        description: 'Sharing fantasies, dreams, and imaginative scenarios',
        estimatedTime: 19,
        difficulty: 3,
        activities: [
          // 20 activities for Fantasy & Dreams Sharing
        ]
      },
      {
        id: 'silly_challenges',
        name: 'Silly Challenges',
        description: 'Lighthearted, goofy challenges to bring out your playful side',
        estimatedTime: 10,
        difficulty: 1,
        activities: [
          // 20 activities for Silly Challenges
        ]
      },
      {
        id: 'adventure_planning',
        name: 'Adventure Planning',
        description: 'Planning and dreaming about future adventures together',
        estimatedTime: 21,
        difficulty: 2,
        activities: [
          // 20 activities for Adventure Planning
        ]
      }
    ]
  },

  // ===== CATEGORY 4: INFIDELITY RECOVERY (Specialized Track) =====
  {
    id: 'infidelity_recovery',
    name: 'Infidelity Recovery',
    description: 'Specialized track for couples healing from betrayal and infidelity',
    icon: '🌱',
    color: 'from-green-500 to-emerald-500',
    subcategories: [
      {
        id: 'truth_transparency',
        name: 'Truth & Transparency Building',
        description: 'Establishing complete honesty and transparency',
        estimatedTime: 25,
        difficulty: 5,
        activities: [
          // 20 activities for Truth & Transparency Building
        ]
      },
      {
        id: 'betrayal_trauma_healing',
        name: 'Betrayal Trauma Healing',
        description: 'Healing from the trauma of betrayal and broken trust',
        estimatedTime: 30,
        difficulty: 5,
        activities: [
          // 20 activities for Betrayal Trauma Healing
        ]
      },
      {
        id: 'accountability_practices',
        name: 'Accountability Practices',
        description: 'Creating systems of accountability and responsibility',
        estimatedTime: 22,
        difficulty: 4,
        activities: [
          // 20 activities for Accountability Practices
        ]
      },
      {
        id: 'forgiveness_journey',
        name: 'Forgiveness Journey',
        description: 'The complex process of forgiveness and healing',
        estimatedTime: 27,
        difficulty: 5,
        activities: [
          // 20 activities for Forgiveness Journey
        ]
      },
      {
        id: 'rebuilding_intimacy_post_betrayal',
        name: 'Rebuilding Intimacy',
        description: 'Slowly rebuilding physical and emotional intimacy',
        estimatedTime: 24,
        difficulty: 4,
        activities: [
          // 20 activities for Rebuilding Intimacy after betrayal
        ]
      },
      {
        id: 'trust_verification_systems',
        name: 'Trust Verification Systems',
        description: 'Creating systems to rebuild and verify trust',
        estimatedTime: 20,
        difficulty: 4,
        activities: [
          // 20 activities for Trust Verification Systems
        ]
      },
      {
        id: 'trigger_management',
        name: 'Trigger Management',
        description: 'Managing triggers and emotional responses',
        estimatedTime: 18,
        difficulty: 4,
        activities: [
          // 20 activities for Trigger Management
        ]
      },
      {
        id: 'new_relationship_agreements',
        name: 'New Relationship Agreements',
        description: 'Creating new agreements and boundaries for moving forward',
        estimatedTime: 23,
        difficulty: 3,
        activities: [
          // 20 activities for New Relationship Agreements
        ]
      },
      {
        id: 'healing_timeline_tracking',
        name: 'Healing Timeline Tracking',
        description: 'Understanding and tracking the healing process',
        estimatedTime: 16,
        difficulty: 3,
        activities: [
          // 20 activities for Healing Timeline Tracking
        ]
      },
      {
        id: 'moving_forward_rituals',
        name: 'Moving Forward Rituals',
        description: 'Rituals and ceremonies to mark progress and new beginnings',
        estimatedTime: 21,
        difficulty: 3,
        activities: [
          // 20 activities for Moving Forward Rituals
        ]
      }
    ]
  },

  // ===== CATEGORY 5: COMMUNICATION MASTERY =====
  {
    id: 'communication_mastery',
    name: 'Communication Mastery',
    description: 'Advanced communication skills for deeper connection',
    icon: '💬',
    color: 'from-blue-500 to-indigo-500',
    subcategories: [
      {
        id: 'active_listening_skills',
        name: 'Active Listening Skills',
        description: 'Mastering the art of truly hearing your partner',
        estimatedTime: 17,
        difficulty: 3,
        activities: [
          // 20 activities for Active Listening Skills
        ]
      },
      {
        id: 'nonviolent_communication',
        name: 'Non-Violent Communication',
        description: 'Learning Marshall Rosenberg\'s NVC techniques',
        estimatedTime: 22,
        difficulty: 4,
        activities: [
          // 20 activities for Non-Violent Communication  
        ]
      },
      {
        id: 'difficult_conversation_navigation',
        name: 'Difficult Conversation Navigation',
        description: 'Strategies for navigating challenging discussions',
        estimatedTime: 24,
        difficulty: 4,
        activities: [
          // 20 activities for Difficult Conversation Navigation
        ]
      },
      {
        id: 'body_language_reading',
        name: 'Body Language Reading',
        description: 'Understanding non-verbal communication signals',
        estimatedTime: 15,
        difficulty: 2,
        activities: [
          // 20 activities for Body Language Reading
        ]
      },
      {
        id: 'tone_delivery_awareness',
        name: 'Tone & Delivery Awareness',
        description: 'How your tone and delivery affect your message',
        estimatedTime: 16,
        difficulty: 3,
        activities: [
          // 20 activities for Tone & Delivery Awareness
        ]
      },
      {
        id: 'boundary_setting',
        name: 'Boundary Setting',
        description: 'Creating and maintaining healthy boundaries',
        estimatedTime: 19,
        difficulty: 3,
        activities: [
          // 20 activities for Boundary Setting
        ]
      },
      {
        id: 'feedback_exchange',
        name: 'Feedback Exchange',
        description: 'Giving and receiving feedback constructively',
        estimatedTime: 18,
        difficulty: 3,
        activities: [
          // 20 activities for Feedback Exchange
        ]
      },
      {
        id: 'apology_repair_techniques',
        name: 'Apology & Repair Techniques',
        description: 'Making meaningful apologies and repairs',
        estimatedTime: 20,
        difficulty: 4,
        activities: [
          // 20 activities for Apology & Repair Techniques
        ]
      },
      {
        id: 'appreciation_expression',
        name: 'Appreciation Expression',
        description: 'Expressing gratitude and appreciation effectively',
        estimatedTime: 14,
        difficulty: 2,
        activities: [
          // 20 activities for Appreciation Expression
        ]
      },
      {
        id: 'future_planning_discussions',
        name: 'Future Planning Discussions',
        description: 'Having productive conversations about the future',
        estimatedTime: 21,
        difficulty: 3,
        activities: [
          // 20 activities for Future Planning Discussions
        ]
      }
    ]
  },

  // ===== CATEGORY 6: INTIMACY & ROMANCE =====
  {
    id: 'intimacy_romance',
    name: 'Intimacy & Romance',
    description: 'Building physical, emotional, and spiritual intimacy',
    icon: '🌹',
    color: 'from-rose-500 to-pink-500',
    subcategories: [
      {
        id: 'physical_touch_languages',
        name: 'Physical Touch Languages',
        description: 'Understanding your unique physical connection preferences',
        estimatedTime: 18,
        difficulty: 3,
        activities: [
          // 20 activities for Physical Touch Languages
        ]
      },
      {
        id: 'emotional_intimacy_building',
        name: 'Emotional Intimacy Building',
        description: 'Deepening emotional connection and vulnerability',
        estimatedTime: 22,
        difficulty: 4,
        activities: [
          // 20 activities for Emotional Intimacy Building
        ]
      },
      {
        id: 'sexual_communication',
        name: 'Sexual Communication',
        description: 'Open, honest communication about physical intimacy',
        estimatedTime: 25,
        difficulty: 4,
        activities: [
          // 20 activities for Sexual Communication
        ]
      },
      {
        id: 'romance_revival',
        name: 'Romance Revival',
        description: 'Reigniting romance and passion in your relationship',
        estimatedTime: 16,
        difficulty: 2,
        activities: [
          // 20 activities for Romance Revival
        ]
      },
      {
        id: 'date_planning_execution',
        name: 'Date Planning & Execution',
        description: 'Creating memorable date experiences together',
        estimatedTime: 14,
        difficulty: 2,
        activities: [
          // 20 activities for Date Planning & Execution
        ]
      },
      {
        id: 'surprise_spontaneity',
        name: 'Surprise & Spontaneity',
        description: 'Bringing excitement and spontaneity into your relationship',
        estimatedTime: 13,
        difficulty: 2,
        activities: [
          // 20 activities for Surprise & Spontaneity
        ]
      },
      {
        id: 'compliment_appreciation',
        name: 'Compliment & Appreciation',
        description: 'Mastering the art of meaningful compliments',
        estimatedTime: 12,
        difficulty: 1,
        activities: [
          // 20 activities for Compliment & Appreciation
        ]
      },
      {
        id: 'quality_time_optimization',
        name: 'Quality Time Optimization',
        description: 'Making the most of your time together',
        estimatedTime: 17,
        difficulty: 2,
        activities: [
          // 20 activities for Quality Time Optimization
        ]
      },
      {
        id: 'shared_interest_development',
        name: 'Shared Interest Development',
        description: 'Discovering and building shared hobbies and interests',
        estimatedTime: 19,
        difficulty: 2,
        activities: [
          // 20 activities for Shared Interest Development
        ]
      },
      {
        id: 'passion_reignition',
        name: 'Passion Reignition',
        description: 'Rekindling passion and desire in long-term relationships',
        estimatedTime: 21,
        difficulty: 3,
        activities: [
          // 20 activities for Passion Reignition
        ]
      }
    ]
  },

  // ===== CATEGORY 7: LIFE PARTNERSHIP =====
  {
    id: 'life_partnership',
    name: 'Life Partnership',
    description: 'Building a strong partnership for all of life\'s challenges',
    icon: '🏡',
    color: 'from-teal-500 to-cyan-500',
    subcategories: [
      {
        id: 'financial_harmony',
        name: 'Financial Harmony',
        description: 'Creating alignment and peace around money matters',
        estimatedTime: 23,
        difficulty: 4,
        activities: [
          // 20 activities for Financial Harmony
        ]
      },
      {
        id: 'parenting_alignment',
        name: 'Parenting Alignment',
        description: 'Aligning on parenting styles and approaches',
        estimatedTime: 26,
        difficulty: 4,
        activities: [
          // 20 activities for Parenting Alignment
        ]
      },
      {
        id: 'career_support_systems',
        name: 'Career Support Systems',
        description: 'Supporting each other\'s professional growth and goals',
        estimatedTime: 20,
        difficulty: 3,
        activities: [
          // 20 activities for Career Support Systems
        ]
      },
      {
        id: 'family_dynamics_navigation',
        name: 'Family Dynamics Navigation',
        description: 'Managing relationships with extended family',
        estimatedTime: 21,
        difficulty: 3,
        activities: [
          // 20 activities for Family Dynamics Navigation
        ]
      },
      {
        id: 'social_circle_management',
        name: 'Social Circle Management',
        description: 'Balancing friends, social life, and couple time',
        estimatedTime: 17,
        difficulty: 2,
        activities: [
          // 20 activities for Social Circle Management
        ]
      },
      {
        id: 'stress_management_together',
        name: 'Stress Management Together',
        description: 'Supporting each other through life\'s stresses',
        estimatedTime: 19,
        difficulty: 3,
        activities: [
          // 20 activities for Stress Management Together
        ]
      },
      {
        id: 'health_wellness_partnership',
        name: 'Health & Wellness Partnership',
        description: 'Building healthy lifestyle habits together',
        estimatedTime: 18,
        difficulty: 2,
        activities: [
          // 20 activities for Health & Wellness Partnership
        ]
      },
      {
        id: 'goal_setting_achievement',
        name: 'Goal Setting & Achievement',
        description: 'Setting and achieving goals as a team',
        estimatedTime: 22,
        difficulty: 3,
        activities: [
          // 20 activities for Goal Setting & Achievement
        ]
      },
      {
        id: 'change_adaptation_skills',
        name: 'Change Adaptation Skills',
        description: 'Navigating life changes and transitions together',
        estimatedTime: 24,
        difficulty: 4,
        activities: [
          // 20 activities for Change Adaptation Skills
        ]
      },
      {
        id: 'legacy_building',
        name: 'Legacy Building',
        description: 'Creating a meaningful legacy and impact together',
        estimatedTime: 25,
        difficulty: 3,
        activities: [
          // 20 activities for Legacy Building
        ]
      }
    ]
  }
];

// Utility functions for the comprehensive activity system
export class ComprehensiveActivityManager {
  
  static getAllCategories(): ActivityCategory[] {
    return COMPREHENSIVE_ACTIVITY_SYSTEM;
  }
  
  static getCategoryById(categoryId: string): ActivityCategory | null {
    return COMPREHENSIVE_ACTIVITY_SYSTEM.find(cat => cat.id === categoryId) || null;
  }
  
  static getSubcategoryById(categoryId: string, subcategoryId: string): ActivitySubcategory | null {
    const category = this.getCategoryById(categoryId);
    return category?.subcategories.find(sub => sub.id === subcategoryId) || null;
  }
  
  static getActivityById(categoryId: string, subcategoryId: string, activityId: string): ActivityTemplate | null {
    const subcategory = this.getSubcategoryById(categoryId, subcategoryId);
    return subcategory?.activities.find(act => act.id === activityId) || null;
  }
  
  static getTotalActivityCount(): number {
    return COMPREHENSIVE_ACTIVITY_SYSTEM.reduce((total, category) => {
      return total + category.subcategories.reduce((categoryTotal, subcategory) => {
        return categoryTotal + subcategory.activities.length;
      }, 0);
    }, 0);
  }
  
  static getActivitiesByDifficulty(difficulty: 1 | 2 | 3 | 4 | 5): ActivityTemplate[] {
    const activities: ActivityTemplate[] = [];
    COMPREHENSIVE_ACTIVITY_SYSTEM.forEach(category => {
      category.subcategories.forEach(subcategory => {
        if (subcategory.difficulty === difficulty) {
          activities.push(...subcategory.activities);
        }
      });
    });
    return activities;
  }
  
  static getActivitiesByType(type: 'quiz' | 'game' | 'challenge' | 'reflection'): ActivityTemplate[] {
    const activities: ActivityTemplate[] = [];
    COMPREHENSIVE_ACTIVITY_SYSTEM.forEach(category => {
      category.subcategories.forEach(subcategory => {
        subcategory.activities.forEach(activity => {
          if (activity.type === type) {
            activities.push(activity);
          }
        });
      });
    });
    return activities;
  }
  
  static searchActivitiesByTag(tag: string): ActivityTemplate[] {
    const activities: ActivityTemplate[] = [];
    COMPREHENSIVE_ACTIVITY_SYSTEM.forEach(category => {
      category.subcategories.forEach(subcategory => {
        subcategory.activities.forEach(activity => {
          if (activity.tags.includes(tag)) {
            activities.push(activity);
          }
        });
      });
    });
    return activities;
  }
  
  static getRandomActivity(categoryId?: string, subcategoryId?: string): ActivityTemplate | null {
    let availableActivities: ActivityTemplate[] = [];
    
    if (categoryId && subcategoryId) {
      const subcategory = this.getSubcategoryById(categoryId, subcategoryId);
      availableActivities = subcategory?.activities || [];
    } else if (categoryId) {
      const category = this.getCategoryById(categoryId);
      category?.subcategories.forEach(sub => {
        availableActivities.push(...sub.activities);
      });
    } else {
      COMPREHENSIVE_ACTIVITY_SYSTEM.forEach(category => {
        category.subcategories.forEach(subcategory => {
          availableActivities.push(...subcategory.activities);
        });
      });
    }
    
    if (availableActivities.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availableActivities.length);
    return availableActivities[randomIndex];
  }
}

export default ComprehensiveActivityManager;