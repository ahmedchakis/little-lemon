// Home.tsx
// React Native screen replicating the provided Little Lemon high‑fidelity wireframe.
// Fetches menu items from the Meta Mobile Developer API and renders them in a list.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { createTable, filterByQueryAndCategories, getMenuItems, saveMenuItems, truncateMenuItems, useUpdateEffect } from '../utils/database';

/** --------------------------------------------------
 *  Types & Constants
 *  --------------------------------------------------*/
interface MenuItem {
    name: string;
    price: string;
    description: string;
    image: string;
    category:string;
}

const MENU_ENDPOINT =
    'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const IMAGE_BASE_URL =
    'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images';

const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Drinks', 'Special'] as const;

/** --------------------------------------------------
 *  Home Screen Component
 *  --------------------------------------------------*/
export default function Home() {
    /* ---------------- state ---------------- */
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(
    CATEGORIES.map(() => false)
  );

    /* ------------- effects ------------- */
    useEffect(() => {
        async function fetchMenu() {
            try {
                await createTable();
                //await truncateMenuItems()
                let menuItems = await getMenuItems();
                console.log('Fetched menu items:', menuItems);
                // The application only fetches the menu data once from a remote URL
                // and then stores it into a SQLite database.     
                // After that, every application restart loads the menu from the database
                if (!menuItems.length) {

                    const res = await fetch(MENU_ENDPOINT);
                    const json = await res.json();
                    setMenu(json.menu ?? []);

                    saveMenuItems(json.menu);
                } else{
                    setMenu(menuItems)
                }

            } catch (err) {
                setError('Impossible de récupérer le menu.');
            } finally {
                setLoading(false);
            }
        }
        fetchMenu();
    }, []);


    /* ------------- derived data ------------- */
      useUpdateEffect(() => {
    (async () => {
      const activeCategories = CATEGORIES.filter((s, i) => {
        // If all filters are deselected, all categories are active
        if (selectedCategory.every((item) => item === false)) {
          return true;
        }
        return selectedCategory[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          searchQuery,
          activeCategories
        );
        console.log("menu items",menuItems)
        setMenu(menuItems)
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [selectedCategory, searchQuery]);
      const handleFiltersChange = async (index:number) => {
    const arrayCopy = [...selectedCategory];
    arrayCopy[index] = !selectedCategory[index];
    setSelectedCategory(arrayCopy);
  };




    /* ------------- item renderer ------------- */
    const renderItem = ({ item }: { item: MenuItem }) => {
        console.log(`${JSON.stringify(item)}`)
        return (
            <View style={styles.menuItemContainer}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.menuItemTitle}>{item.name}</Text>
                    <Text style={styles.menuItemDescription} numberOfLines={2} ellipsizeMode="tail">
                        {item.description}
                    </Text>
                    <Text style={styles.menuItemPrice}>{`$${parseFloat(item.price).toFixed(2)}`}</Text>
                </View>
                <Image
                    source={{ uri: `${IMAGE_BASE_URL}/${item.image}?raw=true` }}
                    style={styles.menuItemImage}
                />
            </View>
        )
    }

    /* ------------- render ------------- */
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* ----- Header Banner ----- */}
            <View style={styles.hero}>


                <View style={styles.banner}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.bannerTitle}>Little Lemon</Text>
                        <Text style={styles.bannerLocation}>Chicago</Text>
                        <Text style={styles.bannerDescription} numberOfLines={4}>
                            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                        </Text>

                    </View>
                    <Image
                        source={{
                            uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80',
                        }}
                        style={styles.bannerImage}
                    />

                </View>
                {/* ----- Search Bar ----- */}
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor="#6b7280"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                    />
                </View>

            </View>

            {/* ----- Category Chips ----- */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsContainer}
            >
                {CATEGORIES.map((cat,index) => (
                    <Pressable
                        key={cat}
                        style={[
                            styles.chip,
                            selectedCategory[index] && styles.chipSelected,
                        ]}
                        onPress={() => handleFiltersChange(index)}
                    >
                        <Text style={[styles.chipLabel, selectedCategory[index] && styles.chipLabelSelected]}>
                            {cat}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            {/* ----- Menu List ----- */}
            <Text style={styles.sectionHeader}>ORDER FOR DELIVERY!</Text>
            <FlatList
                data={menu}
                keyExtractor={(item) => item.name}
                renderItem={renderItem}
                scrollEnabled={false} // ← disable internal scroll; rely on parent ScrollView
                contentContainerStyle={{ paddingBottom: 32 }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </ScrollView>
    );
}

/** --------------------------------------------------
 *  Styles
 *  --------------------------------------------------*/
const styles = StyleSheet.create({
    container: {

        backgroundColor: '#ffffff',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 16,
        fontFamily: "Karla-Regular",
    },
    /* ---------- Banner ---------- */
    hero: {
        backgroundColor: '#415a55',
        paddingBottom: 10
    },
    banner: {
        backgroundColor: '#415a55',
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        gap: 16,
    },

    bannerTitle: {
        color: '#f4c542',
        fontSize: 42,
        lineHeight: 46,
        fontFamily: "MarkaziText-Regular",
    },
    bannerLocation: {
        color: '#d1d5db',
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 12,
        fontFamily: "MarkaziText-Regular",  
    },  
    bannerDescription: {
        color: '#f3f4f6',
        fontSize: 16,
        lineHeight: 22,
    },
    bannerImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
    },
    /* ---------- Search ---------- */
    searchContainer: {
        marginHorizontal: 10
    },
    searchInput: {
        backgroundColor: '#e5e7eb',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111827',
    },
    /* ---------- Chips ---------- */
    chipsContainer: {
        marginTop: 24,
        paddingHorizontal:10,
        flexDirection: 'row',
        gap: 12,
    },
    chip: {
        backgroundColor: '#e5e7eb',
        borderRadius: 22,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    chipSelected: {
        backgroundColor: '#415a55',
    },
    chipLabel: {
        color: '#374151',
        fontWeight: '600',
        fontSize: 14,
        fontFamily: "Karla-Regular",
    },
    chipLabelSelected: {
        color: '#ffffff',
    },
    /* ---------- Menu List ---------- */
    sectionHeader: {
        marginLeft:10,
        marginTop: 32,
        marginBottom: 16,
        fontSize: 22,
        fontWeight: '600',
        color: '#111827',
        
    },
    menuItemContainer: {
        marginLeft:10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    menuItemTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
        fontFamily: "Karla-Regular",
    },
    menuItemDescription: {
        fontSize: 14,
        color: '#475569',
        flexShrink: 1,
        marginBottom: 4,
        fontFamily: "Karla-Regular",
    },
    menuItemPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    menuItemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    separator: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 24,
    },
});
