import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Header, GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

const AntidoteCard = ({ name, description, effect, color }: any) => (
    <LinearGradient
        colors={GRADIENTS.primary.colors}
        start={GRADIENTS.primary.start}
        end={GRADIENTS.primary.end}
        style={[styles.antidoteCard, { borderColor: color }]}
    >
        <Typography variant="caption" style={styles.antidoteName}>{name}</Typography>
        <Typography variant="small" style={styles.antidoteDescription}>{description}</Typography>
        <Typography variant="caption" style={styles.antidoteEffect}>{effect}</Typography>
    </LinearGradient>
);

const GameNode = ({ type, title, subtitle, color, isCurrent }: any) => (
    <View style={styles.nodeContainer}>
        <LinearGradient
            colors={[COLORS.lavenderPurple, COLORS.softViolet]}
            start={GRADIENTS.primary.start}
            end={GRADIENTS.primary.end}
            style={[styles.nodeIcon, { borderColor: color }, isCurrent && styles.currentNodeIcon]}
        >
            {isCurrent ? <Image source={{uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGhRsraipFZhqqSH-91yEjVqjtkysAnF6g9bojd-2VYt6U-1fXEa6i8RHsTzu1UBuG3qtNKYgH8ynKH7B7mfChtT_UugqnJjcY0am1HRyYUJT1TZBr664q9ejEI17_OZIbr_dw8ou8c_kKHS3PTY3l-x8i6AzD1szhKkookc6aQgepcSkQaYRB4ypkVPZb5STfLPIQZSZVZlrN2XgXY230WkVUNrsDJ-qM-U-shBYdZpOw9HPbaPBA1i26h8xeKwhgzDj67qGnUEZi'}} style={styles.playerAvatar} /> : <Typography variant="h2" style={styles.nodeText}>!</Typography>}
        </LinearGradient>
        <View style={styles.nodeLine} />
        <View style={styles.nodeTextContainer}>
            <Typography variant="body" style={styles.nodeTitle}>{title}</Typography>
            <Typography variant="caption" style={styles.nodeSubtitle}>{subtitle}</Typography>
        </View>
    </View>
);

const CycleBreakerBoardGameScreen = () => {

    return (
        <ScreenLayout showHeader={false} scrollable={true}>
            <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.backgroundSecondary]} style={styles.background} />
            
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
                </View>
                <View style={styles.quoteBox}>
                    <Typography variant="sass">Break free from destructive cycles! Identify triggers and rewrite reactions.</Typography>
                </View>
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.mainLayout}>
                    <LinearGradient
                        colors={[COLORS.mintGreen, COLORS.softViolet]}
                        start={GRADIENTS.primary.start}
                        end={GRADIENTS.primary.end}
                        style={styles.leftSidebar}
                    >
                         <LinearGradient
                            colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                            start={GRADIENTS.primary.start}
                            end={GRADIENTS.primary.end}
                            style={styles.glassPanel}
                         >
                             <Typography variant="h2" style={styles.sidebarTitle}>Dr. Marcie's Advice</Typography>
                             <Typography variant="body" style={styles.sidebarText}>"Notice the tension rising. Your partner's silence is a defensive trigger..."</Typography>
                             <SquishyButton style={styles.rollButton}>
                                <Typography variant="button" style={styles.buttonText}>ROLL DICE</Typography>
                             </SquishyButton>
                         </LinearGradient>
                    </LinearGradient>

                    <View style={styles.centerContent}>
                        <LinearGradient
                            colors={[COLORS.warmOrange, COLORS.brightYellow]}
                            start={GRADIENTS.primary.start}
                            end={GRADIENTS.primary.end}
                            style={styles.statusHeader}
                        >
                             <Typography variant="h2" style={styles.statusTitle}>Round 1</Typography>
                             <Typography variant="caption" style={styles.statusSubtitle}>Identify Cycle Trigger</Typography>
                        </LinearGradient>

                        <View style={styles.gameBoard}>
                            <GameNode 
                                type="start" 
                                title="Start" 
                                subtitle="Roll to Begin" 
                                color={COLORS.success}
                                isCurrent={false}
                            />
                            <GameNode 
                                type="trap" 
                                title="Trigger Trap" 
                                subtitle="Defensive Silence" 
                                color={COLORS.warning}
                                isCurrent={true}
                            />
                            <GameNode 
                                type="choice" 
                                title="Choice Point" 
                                subtitle="React or Reflect" 
                                color={COLORS.info}
                                isCurrent={false}
                            />
                            <GameNode 
                                type="antidote" 
                                title="Antidote" 
                                subtitle="Break the Cycle" 
                                color={COLORS.vibrantPink}
                                isCurrent={false}
                            />
                            <GameNode 
                                type="finish" 
                                title="Finish" 
                                subtitle="New Pattern Set" 
                                color={COLORS.success}
                                isCurrent={false}
                            />
                        </View>

                        <View style={styles.antidoteHand}>
                            <AntidoteCard 
                                name="Time-Out" 
                                description="Pause for 20 mins" 
                                effect="Skip trigger" 
                                color={COLORS.mintGreen}
                            />
                            <AntidoteCard 
                                name="Soft Start" 
                                description="Use 'I feel...'" 
                                effect="Reduce damage" 
                                color={COLORS.brightYellow}
                            />
                            <AntidoteCard 
                                name="Repair" 
                                description="Apologize first" 
                                effect="Heal 50%" 
                                color={COLORS.vibrantPink}
                            />
                        </View>
                    </View>

                    <LinearGradient
                        colors={[COLORS.lavenderPurple, COLORS.softViolet]}
                        start={GRADIENTS.primary.start}
                        end={GRADIENTS.primary.end}
                        style={styles.rightSidebar}
                    >
                        <Typography variant="h2" style={styles.sidebarTitle}>Cycle History</Typography>
                        <Typography variant="body" style={styles.sidebarText}>Last 3 arguments followed the same pattern. Time to break it!</Typography>
                    </LinearGradient>
                </View>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.backgroundPrimary },
    background: { ...StyleSheet.absoluteFillObject },
    drMarcieSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.xxlarge,
        padding: SPACING.regular,
        margin: SPACING.regular,
        marginBottom: SPACING.small,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: COLORS.brightYellow,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.regular,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.round,
        resizeMode: 'cover',
    },
    quoteBox: {
        flex: 1,
        backgroundColor: COLORS.backgroundInput,
        borderRadius: BORDER_RADIUS.large,
        padding: SPACING.regular,
    },
    scrollContainer: { flexGrow: 1 },
    mainLayout: { flexDirection: 'row', flex: 1, padding: SPACING.regular },
    leftSidebar: { 
        width: 180, 
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    rightSidebar: { 
        width: 180, 
        padding: SPACING.regular,
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    glassPanel: {
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        padding: SPACING.regular,
    },
    sidebarTitle: { 
        color: COLORS.textPrimary, 
        textAlign: 'center', 
        marginBottom: SPACING.regular,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    sidebarText: { 
        color: COLORS.textPrimary, 
        textAlign: 'center',
        backgroundColor: COLORS.backgroundInput,
        padding: SPACING.small,
        borderRadius: BORDER_RADIUS.medium,
    },
    centerContent: { 
        flex: 1, 
        paddingHorizontal: SPACING.regular 
    },
    rollButton: { 
        alignItems: 'center',
        marginTop: SPACING.regular,
        ...SHADOWS.large,
    },
    buttonText: {
        color: COLORS.vibrantPink,
    },
    nodeText: {
        color: COLORS.textPrimary,
    },
    statusHeader: { 
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.xlarge,
        borderWidth: 2,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    statusTitle: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.regular,
        paddingVertical: SPACING.small,
        borderRadius: BORDER_RADIUS.xxlarge,
    },
    statusSubtitle: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    gameBoard: { flex: 1, justifyContent: 'space-around', alignItems: 'center', paddingVertical: SPACING.xlarge },
    nodeContainer: { alignItems: 'center', marginVertical: SPACING.regular },
    nodeIcon: { 
        width: 50, 
        height: 50, 
        borderRadius: BORDER_RADIUS.round, 
        borderWidth: 2, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    currentNodeIcon: { borderWidth: 3, borderColor: COLORS.vibrantPink },
    playerAvatar: { width: 40, height: 40, borderRadius: BORDER_RADIUS.round },
    nodeLine: { width: 2, height: 40, backgroundColor: COLORS.borderSubtle },
    nodeTextContainer: { alignItems: 'center' },
    nodeTitle: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.large,
    },
    nodeSubtitle: { 
        color: COLORS.textPrimary,
        backgroundColor: COLORS.backgroundInput,
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.tiny,
        borderRadius: BORDER_RADIUS.medium,
    },
    antidoteHand: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: SPACING.regular },
    antidoteCard: { 
        width: 80, 
        height: 110, 
        borderRadius: BORDER_RADIUS.medium, 
        borderWidth: 2,
        padding: SPACING.small, 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.large,
    },
    antidoteName: { 
        textTransform: 'uppercase',
        color: COLORS.textPrimary,
    },
    antidoteDescription: { 
        color: COLORS.textPrimary, 
        textAlign: 'center',
    },
    antidoteEffect: { 
        color: COLORS.textPrimary,
    },
});

export default CycleBreakerBoardGameScreen;
