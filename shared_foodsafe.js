/**
 * Foodagement System - Core Shared State & Utility Library
 * Provides centralized localStorage synchronization, session management,
 * theme persistence, toast notifications, and formatting utilities.
 */

(function (global) {
    'use strict';

    // Storage Keys
    const KEYS = {
        THEME: 'meal_system_theme',
        SESSION: 'foodsafe_user_session',
        KITCHEN_SETTINGS: 'foodsafe_kitchen_settings',
        HISTORICAL: 'meal_historical_consumption',
        FORECAST_TARGET: 'todays_meal_target',
        REDISTRIBUTION: 'meal_redistribution_history',
        NOTIFICATIONS: 'foodsafe_notifications',
        REGISTERED_KITCHENS: 'foodsafe_registered_kitchens'
    };

    // Default Seed Data (When not authenticated)
    const DEFAULT_USER = {
        name: 'Guest Staff',
        role: 'Kitchen Personnel',
        fssaiNumber: '',
        mobile: '',
        kitchenName: 'Commercial Kitchen Facility',
        facilityId: 'Facility #1',
        address: 'Sector 12, Institutional Area, New Delhi - 110001',
        avatarId: 'chef-mia',
        avatarCustomUrl: null,
        isLoggedIn: false
    };

    const DEFAULT_KITCHEN_SETTINGS = {
        kitchenName: 'Central Institutional Kitchen #1',
        facilityId: 'Facility #1 - Main Dining Hall',
        managerName: 'Kitchen Manager',
        status: 'open', // 'open' | 'closed'
        dailySummaryMode: 'auto', // 'auto' (Live/POS Sync) | 'manual'
        defaultMealSizeGrams: 350,
        targetBufferPct: 8,
        costPerMeal: 35.00,
        pricePerMeal: 50.00,
        openingTime: '06:00',
        closingTime: '22:00'
    };

    const DEFAULT_HISTORY = [];
    const DEFAULT_REDISTRIBUTION = [];
    const DEFAULT_NOTIFICATIONS = [];

    // Helper functions for LocalStorage
    function getItem(key, fallback) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch (e) {
            console.error(`Error reading ${key} from localStorage`, e);
            return fallback;
        }
    }

    function setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Error writing ${key} to localStorage`, e);
        }
    }

    // FoodSafe Master API
    const FoodSafe = {
        KEYS,

        // ================= Theme Management =================
        initTheme() {
            const frozenTheme = document.documentElement.getAttribute('data-freeze-theme');
            if (frozenTheme) {
                document.documentElement.setAttribute('data-theme', frozenTheme);
                return frozenTheme;
            }
            const savedTheme = localStorage.getItem(KEYS.THEME) || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.syncThemeUI(savedTheme);
            return savedTheme;
        },

        setTheme(theme) {
            const validTheme = theme === 'dark' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', validTheme);
            localStorage.setItem(KEYS.THEME, validTheme);
            this.syncThemeUI(validTheme);
            window.dispatchEvent(new CustomEvent('foodsafe-theme-change', { detail: { theme: validTheme } }));
            return validTheme;
        },

        toggleTheme() {
            const current = this.getTheme();
            const next = current === 'dark' ? 'light' : 'dark';
            return this.setTheme(next);
        },

        getTheme() {
            return localStorage.getItem(KEYS.THEME) || 'light';
        },

        syncThemeUI(theme) {
            const activeTheme = theme || this.getTheme();
            const darkBtn = document.getElementById('themeDarkBtn');
            const lightBtn = document.getElementById('themeLightBtn');
            if (darkBtn) {
                if (activeTheme === 'dark') darkBtn.classList.add('active');
                else darkBtn.classList.remove('active');
            }
            if (lightBtn) {
                if (activeTheme === 'light') lightBtn.classList.add('active');
                else lightBtn.classList.remove('active');
            }

            const quickToggle = document.getElementById('themeQuickToggleBtn');
            if (quickToggle) {
                quickToggle.setAttribute('title', activeTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
                quickToggle.setAttribute('aria-label', activeTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
            }
        },

        // ================= Session & User Management =================
        getSession() {
            return getItem(KEYS.SESSION, DEFAULT_USER);
        },

        isAuthenticated() {
            const session = this.getSession();
            return Boolean(session && session.isLoggedIn === true);
        },

        requireAuth(redirectUrl = '../login/login.html') {
            if (!this.isAuthenticated()) {
                try {
                    sessionStorage.setItem('foodsafe_auth_redirect_msg', 'Access restricted. Please authenticate with your FSSAI credentials to access the kitchen command center.');
                } catch(e) {}
                window.location.replace(redirectUrl);
                return false;
            }
            return true;
        },

        setSession(userObj) {
            const current = this.getSession();
            const updated = { ...current, ...userObj, isLoggedIn: true, lastLogin: new Date().toISOString() };
            setItem(KEYS.SESSION, updated);
            return updated;
        },

        getUserAvatar() {
            const session = this.getSession();
            return session.avatarId || 'chef-mia';
        },

        setUserAvatar(avatarId, customUrl = null) {
            const session = this.getSession();
            session.avatarId = avatarId;
            session.avatarCustomUrl = customUrl;
            setItem(KEYS.SESSION, session);
            window.dispatchEvent(new CustomEvent('foodsafe-avatar-change', { detail: { avatarId, customUrl } }));
            return session;
        },

        async logout() {
            try {
                if (typeof supabaseClient !== 'undefined' && supabaseClient.auth) {
                    await supabaseClient.auth.signOut();
                }
            } catch(e) {
                console.log('Supabase sign out info:', e);
            }
            const current = this.getSession();
            current.isLoggedIn = false;
            setItem(KEYS.SESSION, current);
        },

        // ================= Automatic Time & Date Kitchen Status Engine =================
        checkAndUpdateKitchenStatus(settings) {
            const current = settings || getItem(KEYS.KITCHEN_SETTINGS, DEFAULT_KITCHEN_SETTINGS);
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const currentTimeStr = `${hours}:${minutes}`;

            const openingTime = current.openingTime || '06:00';
            const closingTime = current.closingTime || '22:00';

            let updated = { ...current };
            let changed = false;

            // 1. New Day Automatic Opening Check:
            // If kitchen was closed on a previous date and now a new day has started
            if (current.lastClosedDate && current.lastClosedDate !== todayStr) {
                if (currentTimeStr >= openingTime && currentTimeStr < closingTime) {
                    updated.status = 'open';
                    updated.lastClosedDate = null;
                    updated.autoOpenedDate = todayStr;
                    updated.manualOverrideForToday = false;
                    changed = true;

                    this.addNotification({
                        id: `auto-open-${Date.now()}`,
                        title: 'Kitchen Open - New Day Service',
                        detail: `A new service day (${todayStr}) has begun! Kitchen status automatically opened at ${currentTimeStr}.`,
                        time: 'Just now',
                        read: false,
                        type: 'info'
                    });
                }
            }

            // 2. Time-of-Day Operating Hours Check:
            const isOutsideOperatingHours = currentTimeStr < openingTime || currentTimeStr >= closingTime;
            
            if (isOutsideOperatingHours && updated.status === 'open' && !updated.manualOverrideForToday) {
                updated.status = 'closed';
                updated.autoClosedReason = `Outside operating hours (${openingTime} - ${closingTime})`;
                changed = true;
            } else if (!isOutsideOperatingHours && updated.status === 'closed' && !updated.lastClosedDate && !updated.manualOverrideForToday) {
                // Within operating hours and not closed via EOD submit
                updated.status = 'open';
                changed = true;
            }

            if (changed) {
                setItem(KEYS.KITCHEN_SETTINGS, updated);
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('foodsafe-settings-change', { detail: updated }));
                }
            }

            return updated;
        },

        // ================= Kitchen Settings =================
        getKitchenSettings() {
            const raw = getItem(KEYS.KITCHEN_SETTINGS, DEFAULT_KITCHEN_SETTINGS);
            return this.checkAndUpdateKitchenStatus(raw);
        },

        saveKitchenSettings(settings) {
            const current = getItem(KEYS.KITCHEN_SETTINGS, DEFAULT_KITCHEN_SETTINGS);
            const updated = { ...current, ...settings };
            setItem(KEYS.KITCHEN_SETTINGS, updated);
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('foodsafe-settings-change', { detail: updated }));
            }
            return updated;
        },

        toggleKitchenStatus() {
            const current = this.getKitchenSettings();
            const newStatus = (current.status === 'open' || !current.status) ? 'closed' : 'open';
            const updated = this.saveKitchenSettings({ 
                status: newStatus,
                manualOverrideForToday: true,
                lastClosedDate: newStatus === 'closed' ? new Date().toISOString().slice(0, 10) : null
            });
            this.toast(`Kitchen status changed to ${newStatus.toUpperCase()}`, newStatus === 'open' ? 'success' : 'warning');
            return updated;
        },

        // ================= Historical Consumption Data =================
        getHistory(shiftFilter) {
            const raw = getItem(KEYS.HISTORICAL, []);
            let list = Array.isArray(raw) ? raw : [];
            if (!shiftFilter || shiftFilter === 'all') return list;
            return list.filter(item => (item.shift || 'Lunch').toLowerCase() === shiftFilter.toLowerCase());
        },

        saveHistory(historyList) {
            setItem(KEYS.HISTORICAL, (historyList || []).slice(0, 24));
        },

        addDailyLog(newLog) {
            let history = this.getHistory('all');
            if (!newLog.attendanceSource) {
                newLog.attendanceSource = newLog.source ? (newLog.source.toLowerCase().includes('ai') ? 'AI' : 'Manual') : 'Manual';
            }
            const shift = newLog.shift || 'Lunch';
            history = history.filter(item => !(item.date === newLog.date && (item.shift || 'Lunch').toLowerCase() === shift.toLowerCase()));
            history.unshift(newLog);
            this.saveHistory(history);
            return history;
        },

        getAverageHistoricalConsumption(days = 3, shift = 'Lunch') {
            const list = this.getHistory(shift);
            if (!list || list.length === 0) return 90;
            const validEntries = list.slice(0, days).map(e => parseFloat(e.foodConsumed) || 0);
            if (validEntries.length === 0) return 90;
            return Math.round(validEntries.reduce((a, b) => a + b, 0) / validEntries.length);
        },

        // ================= Demand Forecast & Targets =================
        getTarget() {
            const todayStr = new Date().toISOString().slice(0, 10);
            return getItem(KEYS.FORECAST_TARGET, {
                portions: null,
                menu: 'Steamed Rice, Dal Makhani, Mixed Veg Curry, Chapatis',
                date: todayStr,
                mealType: 'Lunch',
                weather: 'Sunny',
                event: 'None',
                attendance: null,
                historical: null,
                actualConsumption: null,
                costPerMeal: 35.00,
                pricePerMeal: 50.00,
                riceKg: 15.3,
                dalKg: 8.2,
                vegKg: 12.2,
                oilL: 2.6,
                flourKg: 10.2,
                chapatis: 204
            });
        },

        setTarget(targetObj) {
            const current = this.getTarget();
            const updated = { ...current, ...targetObj };
            
            // Auto compute ingredient weights based on portions if provided
            if (updated.portions !== undefined && updated.portions !== null) {
                const p = parseFloat(updated.portions) || 0;
                if (targetObj.riceKg === undefined) updated.riceKg = +(p * 0.15).toFixed(1);
                if (targetObj.dalKg === undefined) updated.dalKg = +(p * 0.08).toFixed(1);
                if (targetObj.vegKg === undefined) updated.vegKg = +(p * 0.12).toFixed(1);
                if (targetObj.oilL === undefined) updated.oilL = +(p * 0.025).toFixed(1);
                if (targetObj.flourKg === undefined) updated.flourKg = +(p * 0.10).toFixed(1);
                if (targetObj.chapatis === undefined) updated.chapatis = Math.round(p * 2);
            }

            setItem(KEYS.FORECAST_TARGET, updated);
            window.dispatchEvent(new CustomEvent('foodsafe-target-change', { detail: updated }));
            return updated;
        },

        // ================= Surplus & Redistribution History =================
        getRedistribution() {
            return getItem(KEYS.REDISTRIBUTION, DEFAULT_REDISTRIBUTION);
        },

        saveRedistribution(redistList) {
            setItem(KEYS.REDISTRIBUTION, redistList);
        },

        addRedistribution(entry) {
            const list = this.getRedistribution();
            list.unshift(entry);
            this.saveRedistribution(list);

            // Automatically synchronize redistributed portions into active daily shift summary
            const shiftName = entry.shift || 'Lunch';
            const todayDate = new Date().toISOString().slice(0, 10);
            const totalRedistForShift = this.getRedistributedPortionsForShift(todayDate, shiftName);
            
            const shifts = this.getDailyShifts(todayDate);
            if (shifts[shiftName]) {
                shifts[shiftName].foodRedistributed = totalRedistForShift;
                if (shifts[shiftName].foodMade && shifts[shiftName].foodConsumed) {
                    const surplus = Math.max(0, (shifts[shiftName].foodMade || 0) - (shifts[shiftName].foodConsumed || 0));
                    shifts[shiftName].surplus = surplus;
                    shifts[shiftName].waste = Math.max(0, surplus - totalRedistForShift);
                }
                this.saveDailyShifts(todayDate, shifts);
            }

            return list;
        },

        getRedistributedPortionsForShift(dateStr, shiftName) {
            const redistList = this.getRedistribution();
            if (!redistList || redistList.length === 0) return 0;
            const targetShift = (shiftName || 'Lunch').toLowerCase();
            const todayDate = dateStr || new Date().toISOString().slice(0, 10);

            return redistList
                .filter(item => {
                    const itemShift = (item.shift || 'Lunch').toLowerCase();
                    if (itemShift !== targetShift) return false;

                    const itemDate = item.date || '';
                    if (itemDate.includes(todayDate)) return true;
                    if (itemDate.toLowerCase().includes('today')) return true;
                    return false;
                })
                .reduce((sum, item) => sum + (parseFloat(item.portions) || 0), 0);
        },

        // ================= Notifications System =================
        getNotifications() {
            return getItem(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
        },

        saveNotifications(notifs) {
            setItem(KEYS.NOTIFICATIONS, notifs);
        },

        addNotification(notif) {
            const list = this.getNotifications();
            list.unshift(notif);
            this.saveNotifications(list.slice(0, 15));
            return list;
        },

        markAllNotificationsRead() {
            const notifs = this.getNotifications().map(n => ({ ...n, read: true }));
            this.saveNotifications(notifs);
            return notifs;
        },

        clearAllNotifications() {
            this.saveNotifications([]);
            return [];
        },

        getUnreadNotificationCount() {
            return this.getNotifications().filter(n => !n.read).length;
        },

        // ================= Shift Summary & Day-End Closing System =================
        getDailyShifts(dateStr) {
            const todayDate = dateStr || new Date().toISOString().slice(0, 10);
            const key = `foodsafe_shifts_${todayDate}`;
            return getItem(key, {});
        },

        saveDailyShifts(dateStr, shiftsObj) {
            const todayDate = dateStr || new Date().toISOString().slice(0, 10);
            setItem(`foodsafe_shifts_${todayDate}`, shiftsObj);
        },

        autoSaveShift(shiftName, shiftData) {
            const todayDate = shiftData.date || new Date().toISOString().slice(0, 10);
            const shifts = this.getDailyShifts(todayDate);
            shifts[shiftName] = { ...shifts[shiftName], ...shiftData, date: todayDate, shift: shiftName };
            this.saveDailyShifts(todayDate, shifts);

            // Update log in historical store
            this.addDailyLog({
                ...shifts[shiftName],
                date: todayDate,
                shift: shiftName,
                label: `Today (${todayDate})`
            });
            return shifts;
        },

        calibrateTomorrowDemand(dateStr, currentShift = 'Lunch') {
            const todayDate = dateStr || new Date().toISOString().slice(0, 10);
            const shifts = this.getDailyShifts(todayDate);

            // Shift baseline portions
            const shiftDefaults = { 'Breakfast': 80, 'Lunch': 102, 'Snacks': 55, 'Dinner': 95 };
            const ALL_SHIFTS = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

            // Consolidate totals for entire day
            let totalPrepared = 0;
            let totalConsumed = 0;
            let totalAttendance = 0;
            let totalSurplus = 0;
            let totalRedistributed = 0;
            let totalWaste = 0;
            let totalCost = 0;
            let totalRevenue = 0;
            let totalProfit = 0;
            let totalAvoidedCo2 = 0;

            ALL_SHIFTS.forEach(sName => {
                const s = shifts[sName] || {
                    foodMade: shiftDefaults[sName],
                    foodConsumed: Math.round(shiftDefaults[sName] * 0.92),
                    attendance: shiftDefaults[sName],
                    foodRedistributed: Math.max(0, Math.round(shiftDefaults[sName] * 0.05)),
                    costPerMeal: 35.00,
                    pricePerMeal: 50.00
                };
                const made = parseFloat(s.foodMade) || 0;
                const consumed = parseFloat(s.foodConsumed) || 0;
                const attend = parseFloat(s.attendance) || 0;
                const surplus = Math.max(0, made - consumed);
                const redist = parseFloat(s.foodRedistributed) || 0;
                const waste = Math.max(0, surplus - redist);
                const cost = parseFloat(s.totalCost) || (made * (parseFloat(s.costPerMeal) || 35));
                const rev = parseFloat(s.totalRevenue) || (consumed * (parseFloat(s.pricePerMeal) || 50));
                const profit = parseFloat(s.profit) || (rev - cost);
                const co2 = parseFloat(s.avoidedCo2Total) || ((consumed + redist) * 2.0);

                totalPrepared += made;
                totalConsumed += consumed;
                totalAttendance += attend;
                totalSurplus += surplus;
                totalRedistributed += redist;
                totalWaste += waste;
                totalCost += cost;
                totalRevenue += rev;
                totalProfit += profit;
                totalAvoidedCo2 += co2;

                // Ensure full day's shifts are recorded in daily meal logs
                if (this.saveMealLogAsync) {
                    this.saveMealLogAsync({
                        date: todayDate,
                        shift: sName,
                        weather: s.weather || 'Sunny',
                        event: s.event || 'None',
                        attendance: attend,
                        foodMade: made,
                        foodConsumed: consumed,
                        surplus: surplus,
                        foodRedistributed: redist,
                        waste: waste,
                        costPerMeal: parseFloat(s.costPerMeal) || 35,
                        pricePerMeal: parseFloat(s.pricePerMeal) || 50,
                        totalRevenue: rev,
                        totalCost: cost,
                        profit: profit,
                        avoidedCo2Total: co2
                    });
                }
            });

            // Calculate Tomorrow's Date
            const currD = new Date(todayDate);
            currD.setDate(currD.getDate() + 1);
            const tomorrowDate = currD.toISOString().slice(0, 10);

            // Calibrate demand prediction for ALL FOUR SHIFTS of tomorrow
            const allFourForecasts = ALL_SHIFTS.map(shiftName => {
                const basePortion = shiftDefaults[shiftName] || 80;
                const shiftHist = this.getHistory(shiftName);
                const shiftConsumed = (shiftHist && shiftHist.length > 0)
                    ? shiftHist.slice(0, 3).map(h => parseFloat(h.foodConsumed) || (basePortion * 0.9))
                    : [basePortion * 0.9];
                const avgConsumed = shiftConsumed.reduce((a, b) => a + b, 0) / (shiftConsumed.length || 1);
                const targetPortions = Math.round(avgConsumed * 1.08); // 8% buffer

                return {
                    portions: targetPortions,
                    date: tomorrowDate,
                    mealType: shiftName,
                    shift: shiftName,
                    weather: 'Sunny',
                    event: 'None',
                    attendance: Math.round(targetPortions * 0.95),
                    riceKg: +(targetPortions * 0.15).toFixed(1),
                    dalKg: +(targetPortions * 0.08).toFixed(1),
                    vegKg: +(targetPortions * 0.12).toFixed(1),
                    oilL: +(targetPortions * 0.025).toFixed(1),
                    flourKg: +(targetPortions * 0.10).toFixed(1),
                    chapatis: targetPortions * 2,
                    source: 'ai',
                    autoCalibrated: true,
                    calibrationBasisDate: todayDate
                };
            });

            // Store entire day's 4 shifts once at a time in Supabase meal_forecasts and local cache
            if (this.saveAllDayForecastsAsync) {
                this.saveAllDayForecastsAsync(allFourForecasts);
            }

            // Set the active primary target to Breakfast of tomorrow
            const breakfastTarget = allFourForecasts.find(f => f.shift.toLowerCase() === 'breakfast') || allFourForecasts[0];
            // this.setTarget(breakfastTarget); // Removed to prevent shift from resetting when modal opens

            // Add comprehensive notification
            const totalTomorrowMeals = allFourForecasts.reduce((sum, f) => sum + f.portions, 0);
            this.addNotification({
                id: `calibrate-all-${Date.now()}`,
                title: `All 4 Shifts Calibrated for Tomorrow (${tomorrowDate})`,
                detail: `Tomorrow target: ${totalTomorrowMeals} portions across Breakfast (${allFourForecasts[0].portions}), Lunch (${allFourForecasts[1].portions}), Snacks (${allFourForecasts[2].portions}), and Dinner (${allFourForecasts[3].portions}). Stored to database.`,
                time: 'Just now',
                read: false,
                type: 'ai'
            });

            return {
                todayDate,
                targetDate: tomorrowDate,
                tomorrowDate,
                currentShift,
                nextShift: 'Breakfast',
                allFourForecasts,
                totalTomorrowPortions: totalTomorrowMeals,
                tomorrowTargetPortions: totalTomorrowMeals,
                breakfastPortions: allFourForecasts[0].portions,
                lunchPortions: allFourForecasts[1].portions,
                snacksPortions: allFourForecasts[2].portions,
                dinnerPortions: allFourForecasts[3].portions,
                totalPrepared,
                totalConsumed,
                totalAttendance,
                totalSurplus,
                totalRedistributed,
                totalWaste,
                totalCost,
                totalRevenue,
                totalProfit,
                totalAvoidedCo2,
                shiftsCount: 4
            };
        },

        closeDayAndCalibrateTomorrow(dateStr, currentShift = 'Lunch') {
            return this.calibrateTomorrowDemand(dateStr, currentShift);
        },

        // ================= India Real-Time Disaster & Relief Intelligence Engine =================
        getDisasterAlertForPincode(pincodeInput, locationInput) {
            const session = this.getSession() || {};
            let pin = String(pincodeInput || session.pincode || '').trim();
            if (!pin && session.address) {
                const match = session.address.match(/\b(\d{6})\b/);
                if (match) pin = match[1];
            }
            if (!pin && locationInput) {
                const match = String(locationInput).match(/\b(\d{6})\b/);
                if (match) pin = match[1];
            }
            if (!pin || pin.length < 2) {
                pin = '560001'; // Default to Karnataka / Bengaluru
            }

            const prefix2 = pin.substring(0, 2);
            const prefix1 = pin.substring(0, 1);
            const userLoc = (locationInput || session.location || session.address || 'India').replace(/-\s*\d{6}/, '').trim();

            const disasterDatabase = {
                // Delhi NCR (11)
                '11': {
                    state: 'Delhi NCR',
                    region: 'Yamuna Floodplains & Low-Lying NCR Sector',
                    disasterType: 'Yamuna River High Water Level & Inundation Warning',
                    severity: 'High Priority Alert',
                    severityColor: '#dc2626',
                    distanceKm: 8,
                    distanceBadge: '~8 km from your kitchen',
                    incidentDescription: 'Yamuna water level crossed evacuation mark near Old Railway Bridge. 1,800+ families relocated to relief camps across Mayur Vihar & Kashmiri Gate.',
                    affectedPeople: '1,800+ displaced persons',
                    urgentlyNeeded: 'Ready-to-eat hot meals (Khichdi, Pulao, Chapatis, Dal), mineral water pouches, dry rations',
                    coordinatingAgency: 'Delhi Disaster Management Authority (DDMA) & NDRF 8th Bn',
                    verifiedNgos: [
                        { name: 'Robin Hood Army (Delhi NCR Chapter)', contact: '+91 98110 54321', upi: 'rha.delhi@icici', distance: '3.5 km' },
                        { name: 'Akshaya Patra Foundation (Delhi Hub)', contact: '+91 11 2786 1234', upi: 'akshayapatra.delhi@sbi', distance: '5.2 km' },
                        { name: 'Goonj Delhi Processing Center (Sarita Vihar)', contact: '+91 11 2697 2351', upi: 'goonj.delhi@hdfc', distance: '9.0 km' },
                        { name: 'Indian Red Cross Society (National HQ, Delhi)', contact: '+91 11 2371 6441', upi: 'redcross.delhi@sbi', distance: '7.8 km' }
                    ],
                    reliefCamps: [
                        { name: 'Mayur Vihar Phase-1 Flood Relief Tent #4', address: 'Flyover Underpass Ground, Delhi', capacity: '550 persons', neededPortions: 600 },
                        { name: 'Kashmiri Gate ISBT Emergency Evacuation Shelter', address: 'Ring Road Relief Center', capacity: '700 persons', neededPortions: 750 },
                        { name: 'Geeta Colony Community Food Hub', address: 'Near Yamuna Pushta, East Delhi', capacity: '450 persons', neededPortions: 500 }
                    ]
                },
                // Haryana (12, 13)
                '12': {
                    state: 'Haryana',
                    region: 'Ghaggar Basin & Ambala Sector',
                    disasterType: 'Ghaggar River Overflow & Urban Waterlogging',
                    severity: 'Active Flood Warning',
                    severityColor: '#ea580c',
                    distanceKm: 22,
                    distanceBadge: '~22 km away',
                    incidentDescription: 'Continuous catchment rainfall led to Ghaggar breach in low-lying villages. 950+ villagers housed in 4 community schools.',
                    affectedPeople: '950+ villagers displaced',
                    urgentlyNeeded: 'Cooked lunch/dinner packets, bread, milk, dry biscuits, water cans',
                    coordinatingAgency: 'Haryana State Disaster Management Authority',
                    verifiedNgos: [
                        { name: 'Khalsa Aid India (Haryana Relief Team)', contact: '+91 98765 43210', upi: 'khalsaaid.haryana@kotak', distance: '12.0 km' },
                        { name: 'Red Cross Society (Ambala Branch)', contact: '+91 171 2530 123', upi: 'redcross.ambala@sbi', distance: '18.5 km' },
                        { name: 'Robin Hood Army (Panchkula-Ambala)', contact: '+91 98120 99887', upi: 'rha.haryana@icici', distance: '14.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Govt Senior Secondary School Shelter', address: 'Ambala-Naraingarh Road', capacity: '400 persons', neededPortions: 450 },
                        { name: 'Panchayat Bhavan Evacuation Camp', address: 'Sector 7 Relief Site', capacity: '350 persons', neededPortions: 380 }
                    ]
                },
                '13': {
                    state: 'Haryana',
                    region: 'Karnal & Yamunanagar River Belt',
                    disasterType: 'Hathnikund Dam Discharge Flood Alert',
                    severity: 'High Flood Alert',
                    severityColor: '#dc2626',
                    distanceKm: 28,
                    distanceBadge: '~28 km away',
                    incidentDescription: 'High discharge from Hathnikund barrage inundates downstream agricultural and low-lying sectors. Emergency ration hubs active.',
                    affectedPeople: '1,100+ residents',
                    urgentlyNeeded: 'Nutritious hot meals, bottled water, ORS sachets, dry ration kits',
                    coordinatingAgency: 'District Emergency Operations Center (DEOC Yamunanagar)',
                    verifiedNgos: [
                        { name: 'Langar Seva Samiti (Yamunanagar)', contact: '+91 98130 11223', upi: 'langarseva@sbi', distance: '15 km' },
                        { name: 'Robin Hood Army (Karnal Hub)', contact: '+91 98960 55443', upi: 'rha.karnal@icici', distance: '22 km' }
                    ],
                    reliefCamps: [
                        { name: 'Yamuna Belt Community Relief Hall', address: 'Model Town Shelter', capacity: '500 persons', neededPortions: 520 }
                    ]
                },
                // Punjab (14, 15, 16)
                '14': {
                    state: 'Punjab & Chandigarh',
                    region: 'Sutlej River Basin & Ropar Belt',
                    disasterType: 'Sutlej River Inundation & Farm Submersion',
                    severity: 'Red Alert Zone',
                    severityColor: '#dc2626',
                    distanceKm: 19,
                    distanceBadge: '~19 km from kitchen',
                    incidentDescription: 'Sutlej river water overflowing embankments in Anandpur Sahib & Ropar districts. 1,600+ persons shifted to community relief gurudwaras.',
                    affectedPeople: '1,600+ persons evacuated',
                    urgentlyNeeded: 'Fresh hot meals (Dal, Roti, Rice), dry rations, milk powder, packaged water',
                    coordinatingAgency: 'Punjab Disaster Management Authority & NDRF 7th Bn',
                    verifiedNgos: [
                        { name: 'Khalsa Aid International (Punjab Ops)', contact: '+91 172 500 1234', upi: 'khalsaaid@yesbank', distance: '9.5 km' },
                        { name: 'United Sikhs Humanitarian Aid', contact: '+91 98720 12345', upi: 'unitedsikhs@sbi', distance: '14.0 km' },
                        { name: 'Robin Hood Army (Chandigarh-Mohali)', contact: '+91 98880 77665', upi: 'rha.chd@icici', distance: '11.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Gurudwara Sri Keshgarh Sahib Relief Camp', address: 'Anandpur Sahib Sub-division', capacity: '800 persons', neededPortions: 900 },
                        { name: 'Ropar Stadium Temporary Evacuation Camp', address: 'Bela Road, Ropar', capacity: '600 persons', neededPortions: 650 }
                    ]
                },
                '15': {
                    state: 'Punjab',
                    region: 'Beas & Ferozepur Border Belt',
                    disasterType: 'Border Sector Flash Inundation Relief',
                    severity: 'High Flood Priority',
                    severityColor: '#ea580c',
                    distanceKm: 34,
                    distanceBadge: '~34 km away',
                    incidentDescription: 'Low-lying border villages flooded due to upstream surges. Over 1,200 villagers sheltered in relief stations.',
                    affectedPeople: '1,200+ villagers',
                    urgentlyNeeded: 'Ready-to-eat hot food packets, drinking water, dry rations',
                    coordinatingAgency: 'District Disaster Management Authority Ferozepur',
                    verifiedNgos: [
                        { name: 'Khalsa Aid (Ferozepur Chapter)', contact: '+91 98780 44556', upi: 'khalsa.ferozepur@sbi', distance: '16 km' },
                        { name: 'Red Cross Ferozepur', contact: '+91 1632 244123', upi: 'redcross.fzr@sbi', distance: '20 km' }
                    ],
                    reliefCamps: [
                        { name: 'Border Area Relief Complex', address: 'Hussainiwala Sector', capacity: '600 persons', neededPortions: 650 }
                    ]
                },
                '16': {
                    state: 'Chandigarh & Mohali',
                    region: 'Sukhna & Ghaggar Catchment Zone',
                    disasterType: 'Monsoon Heavy Downpour & Flash Waterlogging',
                    severity: 'Orange Alert',
                    severityColor: '#f59e0b',
                    distanceKm: 12,
                    distanceBadge: '~12 km away',
                    incidentDescription: 'Sukhna Choe & seasonal rivulets swelling. 650+ low-lying residents sheltered in community halls.',
                    affectedPeople: '650+ residents',
                    urgentlyNeeded: 'Hot cooked meal packets, water bottles, fruits',
                    coordinatingAgency: 'Chandigarh Disaster Management Authority',
                    verifiedNgos: [
                        { name: 'Robin Hood Army (Chandigarh Chapter)', contact: '+91 98880 77665', upi: 'rha.chd@icici', distance: '5 km' },
                        { name: 'Akshaya Patra Foundation (Tri-City)', contact: '+91 172 260 9988', upi: 'akshayapatra.chd@sbi', distance: '8 km' }
                    ],
                    reliefCamps: [
                        { name: 'Community Center Sector 38 West', address: 'Chandigarh', capacity: '350 persons', neededPortions: 380 }
                    ]
                },
                // Himachal Pradesh (17)
                '17': {
                    state: 'Himachal Pradesh',
                    region: 'Mandi, Kullu & Beas Valley Corridor',
                    disasterType: 'Cloudburst, Flash Flood & Landslide Emergency',
                    severity: 'Critical Red Alert',
                    severityColor: '#dc2626',
                    distanceKm: 26,
                    distanceBadge: '~26 km away',
                    incidentDescription: 'Torrential cloudburst triggered flash floods in Beas tributaries and blocked NH-21. 2,100+ stranded pilgrims & local villagers in relief shelters.',
                    affectedPeople: '2,100+ stranded & displaced individuals',
                    urgentlyNeeded: 'Warm nutritious hot meals (Khichdi, Rajma Chawal), high-energy dry rations, drinking water',
                    coordinatingAgency: 'State Disaster Response Force (SDRF) & NDRF 14th Bn',
                    verifiedNgos: [
                        { name: 'SEEDS India (Himachal Hill Relief)', contact: '+91 1905 223456', upi: 'seedsindia@hdfc', distance: '14.0 km' },
                        { name: 'Goonj Hill Relief Hub', contact: '+91 98160 33445', upi: 'goonj.relief@hdfc', distance: '21.0 km' },
                        { name: 'Red Cross Society (Mandi Branch)', contact: '+91 1905 222144', upi: 'redcross.mandi@sbi', distance: '18.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Pandoh Govt School Evacuation Camp', address: 'NH-21 Pandoh Bypass', capacity: '750 persons', neededPortions: 800 },
                        { name: 'Aut Tunnel Relief & Food Distribution Center', address: 'Mandi-Kullu Highway', capacity: '600 persons', neededPortions: 700 }
                    ]
                },
                // Jammu & Kashmir (18, 19)
                '18': {
                    state: 'Jammu & Kashmir',
                    region: 'Chenab Basin & Jammu Plains',
                    disasterType: 'Chenab River Surge & Highway Landslide Relief',
                    severity: 'High Flood Priority',
                    severityColor: '#ea580c',
                    distanceKm: 30,
                    distanceBadge: '~30 km away',
                    incidentDescription: 'High river discharge and localized landslides near Jammu-Srinagar Highway. Over 1,100 stranded passengers and displaced residents provided food relief.',
                    affectedPeople: '1,100+ individuals',
                    urgentlyNeeded: 'Warm cooked meals, chapatis, packaged drinking water, tea/milk rations',
                    coordinatingAgency: 'J&K Disaster Management Authority (JKDMA)',
                    verifiedNgos: [
                        { name: 'Indian Red Cross Society (Jammu Regional Branch)', contact: '+91 191 254 7890', upi: 'redcross.jammu@sbi', distance: '15 km' },
                        { name: 'Robin Hood Army (Jammu City Chapter)', contact: '+91 94191 22334', upi: 'rha.jammu@icici', distance: '18 km' }
                    ],
                    reliefCamps: [
                        { name: 'Nagrota Highway Emergency Transit Camp', address: 'NH-44 Bypass', capacity: '600 persons', neededPortions: 650 }
                    ]
                },
                '19': {
                    state: 'Jammu & Kashmir',
                    region: 'Jhelum Valley & Srinagar Sector',
                    disasterType: 'Jhelum River High Water Warning & Relief Camp',
                    severity: 'Orange Flood Alert',
                    severityColor: '#ea580c',
                    distanceKm: 16,
                    distanceBadge: '~16 km away',
                    incidentDescription: 'Jhelum water level rising near Sangam & Ram Munshi Bagh. 900+ families accommodated in municipal relief centers.',
                    affectedPeople: '900+ families',
                    urgentlyNeeded: 'Hot cooked rice and curry meals, dry biscuits, milk, clean water cans',
                    coordinatingAgency: 'Srinagar District Disaster Management Authority (DDMA)',
                    verifiedNgos: [
                        { name: 'Help Foundation J&K', contact: '+91 194 245 6789', upi: 'helpfoundation@sbi', distance: '8 km' },
                        { name: 'Athrout Relief Network Srinagar', contact: '+91 94190 66778', upi: 'athrout.relief@jkbank', distance: '11 km' }
                    ],
                    reliefCamps: [
                        { name: 'Indoor Stadium Relief Center', address: 'Rajbagh, Srinagar', capacity: '500 persons', neededPortions: 550 }
                    ]
                },
                // Uttar Pradesh (20-28)
                '20': {
                    state: 'Uttar Pradesh',
                    region: 'Western UP & Hindon Basin',
                    disasterType: 'Hindon River Overflow & Industrial Belt Flooding',
                    severity: 'High Priority Alert',
                    severityColor: '#ea580c',
                    distanceKm: 14,
                    distanceBadge: '~14 km from kitchen',
                    incidentDescription: 'Hindon floodwaters entered low-lying sectors of Ghaziabad & Noida. 1,500+ industrial and migrant worker families housed in flood shelters.',
                    affectedPeople: '1,500+ displaced persons',
                    urgentlyNeeded: 'Cooked meals (Poori Sabzi, Khichdi, Rice Dal), drinking water, baby food',
                    coordinatingAgency: 'UP Disaster Management Authority & District Magistrate Office',
                    verifiedNgos: [
                        { name: 'Robin Hood Army (Noida-Ghaziabad)', contact: '+91 98101 22334', upi: 'rha.noida@icici', distance: '6.0 km' },
                        { name: 'Goonj Delhi-NCR Processing Hub', contact: '+91 11 2697 2351', upi: 'goonj.delhi@hdfc', distance: '12.0 km' },
                        { name: 'Akshaya Patra Foundation (Ghaziabad Kitchen)', contact: '+91 120 270 4455', upi: 'akshayapatra.gzb@sbi', distance: '8.5 km' }
                    ],
                    reliefCamps: [
                        { name: 'Chhijarsi Flood Shelter Camp #2', address: 'Near Hindon Pushta, Sector 63', capacity: '600 persons', neededPortions: 650 },
                        { name: 'Ecotech Evacuation Relief Hall', address: 'Greater Noida West', capacity: '450 persons', neededPortions: 500 }
                    ]
                },
                '22': {
                    state: 'Uttar Pradesh',
                    region: 'Central UP & Gomti Basin (Lucknow / Kanpur)',
                    disasterType: 'Gomti & Ganga River Waterlogging & Shelter Relief',
                    severity: 'Moderate Priority Flood',
                    severityColor: '#f59e0b',
                    distanceKm: 20,
                    distanceBadge: '~20 km away',
                    incidentDescription: 'Gomti catchment overflow in low-lying peri-urban settlements. 1,000+ residents sheltered in municipal community halls.',
                    affectedPeople: '1,000+ residents',
                    urgentlyNeeded: 'Cooked hot meals, water bottles, glucose packets, dry food',
                    coordinatingAgency: 'Lucknow District Disaster Management Authority',
                    verifiedNgos: [
                        { name: 'Robin Hood Army (Lucknow Chapter)', contact: '+91 94150 11223', upi: 'rha.lucknow@icici', distance: '8 km' },
                        { name: 'Akshaya Patra Foundation (Lucknow Kitchen)', contact: '+91 522 277 8899', upi: 'akshayapatra.lko@sbi', distance: '12 km' }
                    ],
                    reliefCamps: [
                        { name: 'Alambagh Municipal Evacuation Hall', address: 'Lucknow Central', capacity: '500 persons', neededPortions: 520 }
                    ]
                },
                '27': {
                    state: 'Uttar Pradesh',
                    region: 'Eastern UP & Rapti Basin (Gorakhpur / Basti)',
                    disasterType: 'Rapti & Rohini River Severe Flood Crisis',
                    severity: 'Critical Flood Red Alert',
                    severityColor: '#dc2626',
                    distanceKm: 24,
                    distanceBadge: '~24 km away',
                    incidentDescription: 'Rapti and Rohini rivers crossed danger mark. 2,800+ villagers evacuated into embankment relief camps.',
                    affectedPeople: '2,800+ villagers',
                    urgentlyNeeded: 'Mass hot meal distribution (Khichdi, Dal Rice), dry food packets, mineral water',
                    coordinatingAgency: 'State Disaster Response Force (SDRF Gorakhpur)',
                    verifiedNgos: [
                        { name: 'Gorakhnath Seva Trust Relief Hub', contact: '+91 551 233 4455', upi: 'gorakhnath.seva@sbi', distance: '10 km' },
                        { name: 'Red Cross Society (Gorakhpur Branch)', contact: '+91 551 220 1122', upi: 'redcross.gkp@sbi', distance: '14 km' }
                    ],
                    reliefCamps: [
                        { name: 'Rohini Pushta Flood Relief Camp #1', address: 'Gorakhpur North', capacity: '900 persons', neededPortions: 1000 }
                    ]
                },
                // Uttarakhand (24, 25, 26)
                '24': {
                    state: 'Uttarakhand',
                    region: 'Garhwal Himalaya & Alaknanda Valley (Rishikesh/Dehradun)',
                    disasterType: 'Ganga-Alaknanda Monsoon Spate & Landslide Alert',
                    severity: 'High Mountain Red Alert',
                    severityColor: '#dc2626',
                    distanceKm: 22,
                    distanceBadge: '~22 km away',
                    incidentDescription: 'High discharge at Tehri dam and heavy hill rainfall. 1,400+ pilgrims & valley residents housed in transit relief camps.',
                    affectedPeople: '1,400+ pilgrims & residents',
                    urgentlyNeeded: 'Nutritious hot meals, chapatis, dal, dry emergency ration packets, drinking water',
                    coordinatingAgency: 'Uttarakhand State Disaster Management Authority (USDMA)',
                    verifiedNgos: [
                        { name: 'Goonj Uttarakhand Relief Hub', contact: '+91 135 277 8899', upi: 'goonj.uk@hdfc', distance: '14.0 km' },
                        { name: 'Parmarth Niketan Disaster Relief Seva', contact: '+91 135 244 0088', upi: 'parmarth.seva@sbi', distance: '10.5 km' },
                        { name: 'Robin Hood Army (Dehradun Chapter)', contact: '+91 98970 12345', upi: 'rha.dehradun@icici', distance: '16.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Rishikesh Transit Evacuation Shelter', address: 'Badrinath Marg Relief Center', capacity: '700 persons', neededPortions: 750 },
                        { name: 'Tapovan Emergency Food Hub', address: 'Muni Ki Reti Ground', capacity: '500 persons', neededPortions: 550 }
                    ]
                },
                // Rajasthan (30-34)
                '30': {
                    state: 'Rajasthan',
                    region: 'Jaipur & Central Rajasthan Sector',
                    disasterType: 'Flash Inundation & Peri-Urban Evacuation Camp',
                    severity: 'Moderate Priority',
                    severityColor: '#ea580c',
                    distanceKm: 18,
                    distanceBadge: '~18 km away',
                    incidentDescription: 'Heavy spell caused severe waterlogging in Dravyavati basin and slum settlements. 800+ individuals relocated to relief shelters.',
                    affectedPeople: '800+ persons',
                    urgentlyNeeded: 'Fresh hot meal packets (Poori Sabzi, Khichdi), clean water cans, buttermilk',
                    coordinatingAgency: 'Jaipur District Disaster Management Cell',
                    verifiedNgos: [
                        { name: 'Akshaya Patra Foundation (Jaipur Mega Kitchen)', contact: '+91 141 278 1234', upi: 'akshayapatra.jaipur@sbi', distance: '7.5 km' },
                        { name: 'Robin Hood Army (Jaipur Chapter)', contact: '+91 98290 55667', upi: 'rha.jaipur@icici', distance: '9.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Sanganer Municipal Community Shelter', address: 'Tonk Road Relief Site', capacity: '450 persons', neededPortions: 500 }
                    ]
                },
                // Gujarat (36-39)
                '38': {
                    state: 'Gujarat',
                    region: 'Ahmedabad & Sabarmati Belt',
                    disasterType: 'Sabarmati Catchment Surge & Evacuation Relief',
                    severity: 'High Flood Priority',
                    severityColor: '#ea580c',
                    distanceKm: 15,
                    distanceBadge: '~15 km away',
                    incidentDescription: 'Upstream Dharoi dam discharge raised Sabarmati level. 1,600+ residents evacuated from riverbank lowlands to municipal schools.',
                    affectedPeople: '1,600+ residents',
                    urgentlyNeeded: 'Ready hot meals (Thepla, Khichdi, Dal Rice), bottled drinking water, buttermilk packets',
                    coordinatingAgency: 'Gujarat State Disaster Management Authority (GSDMA) & AMC',
                    verifiedNgos: [
                        { name: 'Akshaya Patra Foundation (Ahmedabad Mega Hub)', contact: '+91 79 2328 8899', upi: 'akshayapatra.guj@sbi', distance: '6.0 km' },
                        { name: 'Robin Hood Army (Ahmedabad Chapter)', contact: '+91 98250 11223', upi: 'rha.ahmedabad@icici', distance: '8.5 km' },
                        { name: 'Red Cross Society (Gujarat State Branch)', contact: '+91 79 2658 9911', upi: 'redcross.guj@sbi', distance: '11.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Vasna Community Relief Hall', address: 'Riverfront South Shelter', capacity: '600 persons', neededPortions: 650 },
                        { name: 'Sabarmati Municipal Primary School #8', address: 'Ahmedabad West', capacity: '550 persons', neededPortions: 600 }
                    ]
                },
                '39': {
                    state: 'Gujarat',
                    region: 'Surat & Tapi River Estuary',
                    disasterType: 'Tapi River Spate & Low-Lying Inundation Warning',
                    severity: 'High Flood Warning',
                    severityColor: '#dc2626',
                    distanceKm: 12,
                    distanceBadge: '~12 km away',
                    incidentDescription: 'Ukai dam discharge pushed Tapi river above warning level. 1,900+ residents sheltered in Surat Municipal relief camps.',
                    affectedPeople: '1,900+ residents',
                    urgentlyNeeded: 'Hot cooked meal packets, water pouches, energy biscuits',
                    coordinatingAgency: 'Surat Municipal Disaster Response Cell',
                    verifiedNgos: [
                        { name: 'Akshaya Patra (Surat Central)', contact: '+91 261 245 6789', upi: 'akshayapatra.surat@sbi', distance: '5 km' },
                        { name: 'Robin Hood Army (Surat)', contact: '+91 98240 77889', upi: 'rha.surat@icici', distance: '7 km' }
                    ],
                    reliefCamps: [
                        { name: 'Rander Flood Relief Shelter', address: 'Surat West', capacity: '700 persons', neededPortions: 750 }
                    ]
                },
                // Maharashtra (40-44)
                '40': {
                    state: 'Maharashtra',
                    region: 'Mumbai Metropolitan & Konkan Coast',
                    disasterType: 'Monsoonal Flash Waterlogging & High Tide Relief Camp',
                    severity: 'Red Weather Alert',
                    severityColor: '#dc2626',
                    distanceKm: 11,
                    distanceBadge: '~11 km from your kitchen',
                    incidentDescription: 'Extremely heavy rainfall coupled with 4.5m Arabian Sea high tide flooded low-lying suburban corridors (Kurla, Sion, Milan subway). 1,750+ commuters & displaced slum dwellers in emergency shelters.',
                    affectedPeople: '1,750+ displaced persons & transit commuters',
                    urgentlyNeeded: 'Hot food packets (Khichdi, Pulao, Poha, Roti Subzi), clean drinking water pouches, dry snacks',
                    coordinatingAgency: 'Brihanmumbai Disaster Management Cell (BMDC) & NDRF 5th Bn',
                    verifiedNgos: [
                        { name: 'Roti Bank Mumbai (Dabbawala Network)', contact: '+91 86555 80001', upi: 'rotibankmumbai@icici', distance: '4.5 km' },
                        { name: 'Robin Hood Army (Mumbai Chapter)', contact: '+91 98200 44556', upi: 'rha.mumbai@icici', distance: '6.2 km' },
                        { name: 'Khaana Chahiye Foundation', contact: '+91 98190 12345', upi: 'khaanachahiye@hdfc', distance: '8.0 km' },
                        { name: 'Goonj Mumbai Disaster Relief Depot', contact: '+91 22 2845 6789', upi: 'goonj.mumbai@hdfc', distance: '12.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Kurla Municipal Transit Camp #1', address: 'LBS Marg Relief Ground, Kurla West', capacity: '700 persons', neededPortions: 750 },
                        { name: 'Sion East Community Welfare Shelter', address: 'Near Sion Station Relief Hub', capacity: '550 persons', neededPortions: 600 },
                        { name: 'Chembur Municipal School Relief Center', address: 'Suburban East Shelter', capacity: '500 persons', neededPortions: 550 }
                    ]
                },
                '41': {
                    state: 'Maharashtra',
                    region: 'Pune & Mutha Basin / Western Ghats',
                    disasterType: 'Khadakwasla Dam Discharge & River Basin Inundation',
                    severity: 'High Flood Priority',
                    severityColor: '#ea580c',
                    distanceKm: 16,
                    distanceBadge: '~16 km away',
                    incidentDescription: 'High discharge from Khadakwasla dam flooded Sinhagad Road and low-lying riverside societies. 1,200+ citizens evacuated to municipal centers.',
                    affectedPeople: '1,200+ residents',
                    urgentlyNeeded: 'Hot meals (Rice, Pithla-Bhakri, Dal Khichdi), drinking water cans, milk',
                    coordinatingAgency: 'Pune Municipal Disaster Management Cell (PMC)',
                    verifiedNgos: [
                        { name: 'Robin Hood Army (Pune Chapter)', contact: '+91 98220 33445', upi: 'rha.pune@icici', distance: '5.5 km' },
                        { name: 'Akshaya Patra Foundation (Pune Kitchen)', contact: '+91 20 2426 1234', upi: 'akshayapatra.pune@sbi', distance: '9.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Sinhagad Road Municipal School Shelter', address: 'Vitthalwadi Relief Center', capacity: '500 persons', neededPortions: 550 },
                        { name: 'Deccan Gymkhana Relief Point', address: 'PMC Ground', capacity: '400 persons', neededPortions: 450 }
                    ]
                },
                // Telangana (50)
                '50': {
                    state: 'Telangana',
                    region: 'Hyderabad & Musi River Basin',
                    disasterType: 'Musi River High Inundation & Urban Lowland Relief',
                    severity: 'High Flood Warning',
                    severityColor: '#ea580c',
                    distanceKm: 14,
                    distanceBadge: '~14 km away',
                    incidentDescription: 'Himayat Sagar & Osman Sagar floodgates opened. Musi river inundation affected Chaderghat, Moosarambagh & Amberpet. 1,550+ residents in relief centers.',
                    affectedPeople: '1,550+ displaced residents',
                    urgentlyNeeded: 'Nutritious hot meal packets (Veg Biryani, Khichdi, Sambar Rice), drinking water packets, dry biscuits',
                    coordinatingAgency: 'GHMC Disaster Response Force (DRF) & TG Disaster Management',
                    verifiedNgos: [
                        { name: 'Robin Hood Army (Hyderabad Chapter)', contact: '+91 98490 12345', upi: 'rha.hyd@icici', distance: '6.0 km' },
                        { name: 'Akshaya Patra Foundation (Telangana Hub)', contact: '+91 40 2339 1234', upi: 'akshayapatra.tg@sbi', distance: '8.5 km' },
                        { name: 'Feed The Need (GHMC Kitchens)', contact: '+91 40 2111 1111', upi: 'feedtheneed.hyd@sbi', distance: '5.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Chaderghat Community Relief Center', address: 'Old Bridge Relief Ground', capacity: '600 persons', neededPortions: 650 },
                        { name: 'Amberpet Municipal Welfare Hall', address: 'Musi Riverside Shelter', capacity: '500 persons', neededPortions: 550 }
                    ]
                },
                // Andhra Pradesh (51-53)
                '52': {
                    state: 'Andhra Pradesh',
                    region: 'Vijayawada & Krishna Delta',
                    disasterType: 'Krishna River Prakasam Barrage Record Inundation',
                    severity: 'Critical Flood Red Alert',
                    severityColor: '#dc2626',
                    distanceKm: 18,
                    distanceBadge: '~18 km away',
                    incidentDescription: 'Historic 11-lakh cusec discharge through Prakasam Barrage. Singh Nagar, Payakapuram & Krishna lowlands submerged. 3,500+ citizens in emergency relief camps.',
                    affectedPeople: '3,500+ displaced persons',
                    urgentlyNeeded: 'Mass hot meals (Puliyogare, Tomato Rice, Sambar Rice, Khichdi), bottled drinking water, bread & dry rations',
                    coordinatingAgency: 'AP State Disaster Management Authority (APSDMA) & NDRF 10th Bn',
                    verifiedNgos: [
                        { name: 'Akshaya Patra Foundation (Vijayawada Mega Kitchen)', contact: '+91 866 257 8899', upi: 'akshayapatra.vja@sbi', distance: '5.5 km' },
                        { name: 'Robin Hood Army (Vijayawada Hub)', contact: '+91 98480 33445', upi: 'rha.vja@icici', distance: '7.0 km' },
                        { name: 'Red Cross Society (Andhra Pradesh Branch)', contact: '+91 866 247 1234', upi: 'redcross.ap@sbi', distance: '9.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Singh Nagar BRTS Evacuation Camp #1', address: 'Vijayawada North Relief Point', capacity: '1,200 persons', neededPortions: 1300 },
                        { name: 'Indira Gandhi Municipal Stadium Relief Hub', address: 'MG Road, Vijayawada', capacity: '900 persons', neededPortions: 1000 }
                    ]
                },
                '53': {
                    state: 'Andhra Pradesh',
                    region: 'Visakhapatnam Coastal Sector',
                    disasterType: 'Bay of Bengal Coastal Severe Weather & Cyclone Warning',
                    severity: 'High Coastal Priority',
                    severityColor: '#ea580c',
                    distanceKm: 15,
                    distanceBadge: '~15 km away',
                    incidentDescription: 'Deep depression in Bay of Bengal triggered high tidal waves and low-lying coastal flooding in fisher colonies. 1,100+ families accommodated in cyclone shelters.',
                    affectedPeople: '1,100+ coastal families',
                    urgentlyNeeded: 'Hot cooked meal packets, dry provisions, clean drinking water cans',
                    coordinatingAgency: 'GVMC Disaster Management Cell & Indian Coast Guard',
                    verifiedNgos: [
                        { name: 'Akshaya Patra Foundation (Vizag Kitchen)', contact: '+91 891 250 1234', upi: 'akshayapatra.vizag@sbi', distance: '6 km' },
                        { name: 'Robin Hood Army (Vizag)', contact: '+91 98490 77889', upi: 'rha.vizag@icici', distance: '8 km' }
                    ],
                    reliefCamps: [
                        { name: 'Bheemili Multipurpose Cyclone Shelter', address: 'Beach Road, Visakhapatnam', capacity: '600 persons', neededPortions: 650 }
                    ]
                },
                // Karnataka (56-59)
                '56': {
                    state: 'Karnataka',
                    region: 'Bengaluru Urban & Cauvery Basin Corridor',
                    disasterType: 'Urban Flash Waterlogging & Cauvery Basin Evacuation Relief',
                    severity: 'High Priority Alert',
                    severityColor: '#dc2626',
                    distanceKm: 16,
                    distanceBadge: '~16 km from your kitchen',
                    incidentDescription: 'Severe cloudburst and lake breach overflow inundated Bellandur, Sarjapur & Mahadevapura lowlands. 1,450+ residents & migrant worker families in municipal relief centers.',
                    affectedPeople: '1,450+ displaced individuals',
                    urgentlyNeeded: 'Hot cooked meals (Bisi Bele Bath, Rice Sambhar, Puliyogare, Khichdi), clean drinking water bottles, dry biscuits',
                    coordinatingAgency: 'Karnataka State Disaster Management Authority (KSDMA) & BBMP Disaster Cell',
                    verifiedNgos: [
                        { name: 'Akshaya Patra Foundation (Bengaluru Hub)', contact: '+91 80 3014 3400', upi: 'akshayapatra@sbi', distance: '5.8 km' },
                        { name: 'Robin Hood Army (Bangalore Central)', contact: '+91 98450 12345', upi: 'rha.bangalore@icici', distance: '7.2 km' },
                        { name: 'Indian Red Cross Society (Karnataka State Branch)', contact: '+91 80 2226 4205', upi: 'redcross.karnataka@sbi', distance: '10.5 km' },
                        { name: 'Goonj Bangalore Processing Depot (Hosur Rd)', contact: '+91 80 2574 2639', upi: 'goonj.relief@hdfc', distance: '13.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'BBMP Community Center Evacuation Shelter #4', address: 'Ward 150 Bellandur Relief Ground', capacity: '550 persons', neededPortions: 600 },
                        { name: 'Govt Model Primary School Relief Camp', address: 'Sarjapur Road Shelter', capacity: '450 persons', neededPortions: 500 },
                        { name: 'Kanteerava Indoor Transit Relief Hub', address: 'Central Bengaluru Distribution Point', capacity: '600 persons', neededPortions: 650 }
                    ]
                },
                '57': {
                    state: 'Karnataka',
                    region: 'Kodagu & Western Ghats Sector',
                    disasterType: 'Western Ghats Landslide & River Basin Red Alert',
                    severity: 'Critical Red Alert',
                    severityColor: '#dc2626',
                    distanceKm: 28,
                    distanceBadge: '~28 km away',
                    incidentDescription: 'Continuous torrential rains triggered landslides in Bhagamandala & Talacauvery valleys. Over 1,300 plantation workers & villagers in emergency relief camps.',
                    affectedPeople: '1,300+ villagers',
                    urgentlyNeeded: 'Hot nutritious meals (Rice, Sambar, Upma, Tea/Milk), dry ration kits, water cans',
                    coordinatingAgency: 'Kodagu District Disaster Management Authority (DDMA)',
                    verifiedNgos: [
                        { name: 'Coorg Wildlife & Disaster Relief Society', contact: '+91 8272 225566', upi: 'coorgrelief@sbi', distance: '12 km' },
                        { name: 'Red Cross Society (Madikeri)', contact: '+91 8272 228990', upi: 'redcross.kodagu@sbi', distance: '16 km' }
                    ],
                    reliefCamps: [
                        { name: 'Madikeri Town Hall Relief Camp', address: 'Madikeri Central', capacity: '500 persons', neededPortions: 550 }
                    ]
                },
                // Tamil Nadu (60-64)
                '60': {
                    state: 'Tamil Nadu',
                    region: 'Chennai Metropolitan & Coastal Belt',
                    disasterType: 'Northeast Monsoon & Adyar-Coom River Flood Relief',
                    severity: 'High Coastal Warning',
                    severityColor: '#dc2626',
                    distanceKm: 13,
                    distanceBadge: '~13 km from your kitchen',
                    incidentDescription: 'Intense cyclonic downpour breached stormwater capacity in Velachery, Mudichur & Tambaram lowlands. 2,100+ residents sheltered in Greater Chennai Corporation relief centers.',
                    affectedPeople: '2,100+ displaced persons',
                    urgentlyNeeded: 'Hot cooked meal packets (Sambar Rice, Lemon Rice, Pongal, Curd Rice), packaged water bottles, dry snacks',
                    coordinatingAgency: 'Tamil Nadu State Disaster Management Authority (TNSDMA) & GCC',
                    verifiedNgos: [
                        { name: 'Akshaya Patra Foundation (Chennai Central)', contact: '+91 44 2836 1234', upi: 'akshayapatra.tn@sbi', distance: '5.2 km' },
                        { name: 'Robin Hood Army (Chennai Chapter)', contact: '+91 98400 55667', upi: 'rha.chennai@icici', distance: '6.8 km' },
                        { name: 'Bhoomi Food Relief Network', contact: '+91 44 4350 1234', upi: 'bhoomi.relief@hdfc', distance: '9.0 km' },
                        { name: 'Indian Red Cross Society (Tamil Nadu Branch)', contact: '+91 44 2855 4548', upi: 'redcross.tn@sbi', distance: '8.5 km' }
                    ],
                    reliefCamps: [
                        { name: 'GCC Community Hall Relief Shelter #8', address: 'Velachery Bypass Relief Site', capacity: '750 persons', neededPortions: 800 },
                        { name: 'Tambaram Municipal School Evacuation Center', address: 'Mudichur Road, Chennai South', capacity: '600 persons', neededPortions: 650 },
                        { name: 'Saidapet Riverbank Transit Food Hub', address: 'Near Adyar Bridge Relief Camp', capacity: '500 persons', neededPortions: 550 }
                    ]
                },
                '64': {
                    state: 'Tamil Nadu',
                    region: 'Coimbatore & Nilgiris Foothills',
                    disasterType: 'Nilgiris Mountain Heavy Rain & Flash Inundation',
                    severity: 'Orange Flood Warning',
                    severityColor: '#ea580c',
                    distanceKm: 24,
                    distanceBadge: '~24 km away',
                    incidentDescription: 'Noyyal river in spate and localized mudslides in Mettupalayam corridor. 850+ residents housed in municipal relief shelters.',
                    affectedPeople: '850+ residents',
                    urgentlyNeeded: 'Hot food packets, mineral water, blankets, dry provisions',
                    coordinatingAgency: 'Coimbatore District Disaster Management Authority',
                    verifiedNgos: [
                        { name: 'No Food Waste (Coimbatore Hub)', contact: '+91 90877 90877', upi: 'nofoodwaste@icici', distance: '7.0 km' },
                        { name: 'Robin Hood Army (Coimbatore Chapter)', contact: '+91 98420 11223', upi: 'rha.cbe@icici', distance: '8.5 km' }
                    ],
                    reliefCamps: [
                        { name: 'Singanallur Community Relief Center', address: 'Trichy Road Shelter', capacity: '450 persons', neededPortions: 500 }
                    ]
                },
                // Kerala (67-69)
                '67': {
                    state: 'Kerala',
                    region: 'Wayanad, Kozhikode & Malabar Sector',
                    disasterType: 'Wayanad Mountain Landslide & Flash Flood Red Alert',
                    severity: 'Critical Disaster Red Alert',
                    severityColor: '#dc2626',
                    distanceKm: 25,
                    distanceBadge: '~25 km away',
                    incidentDescription: 'Massive landslide disaster in Meppadi & Chooralmala hills. Over 2,600 displaced residents and rescue personnel housed across 16 evacuation camps.',
                    affectedPeople: '2,600+ survivors & rescue personnel',
                    urgentlyNeeded: 'High-volume hot cooked meals (Kerala Rice, Sambar, Thoran, Kanji), mineral water cans, dry rations, high-energy snacks',
                    coordinatingAgency: 'Kerala State Disaster Management Authority (KSDMA) & Indian Army / NDRF',
                    verifiedNgos: [
                        { name: 'Robin Hood Army (Kerala Relief Team)', contact: '+91 98470 33445', upi: 'rha.kerala@icici', distance: '12.0 km' },
                        { name: 'Goonj Kerala Relief Base', contact: '+91 484 280 1234', upi: 'goonj.kerala@hdfc', distance: '18.5 km' },
                        { name: 'Indian Red Cross Society (Wayanad Branch)', contact: '+91 4936 202 345', upi: 'redcross.wayanad@sbi', distance: '14.0 km' },
                        { name: 'Nanma Food Bank Kerala', contact: '+91 94470 12345', upi: 'nanma.kerala@sbi', distance: '16.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Meppadi Govt Higher Secondary School Relief Camp', address: 'Meppadi Town, Wayanad', capacity: '900 persons', neededPortions: 1000 },
                        { name: 'Kalpetta Municipal Community Evacuation Center', address: 'Kalpetta Central Shelter', capacity: '800 persons', neededPortions: 850 },
                        { name: 'Chooralmala Rescue Transit Food Station', address: 'Rescue Base Camp', capacity: '650 persons', neededPortions: 700 }
                    ]
                },
                '68': {
                    state: 'Kerala',
                    region: 'Ernakulam & Periyar Basin / Idukki',
                    disasterType: 'Periyar River Spate & Lowland Waterlogging',
                    severity: 'High Flood Priority',
                    severityColor: '#dc2626',
                    distanceKm: 17,
                    distanceBadge: '~17 km away',
                    incidentDescription: 'Idamalayar & Idukki dam shutter operations increased Periyar water levels in Aluva & Paravur. 1,650+ residents in relief centers.',
                    affectedPeople: '1,650+ residents',
                    urgentlyNeeded: 'Cooked hot meals, drinking water bottles, bread, dry provisions',
                    coordinatingAgency: 'Ernakulam District Disaster Management Authority (DDMA)',
                    verifiedNgos: [
                        { name: 'Akshaya Patra Foundation (Kochi Kitchen)', contact: '+91 484 260 7788', upi: 'akshayapatra.kerala@sbi', distance: '6 km' },
                        { name: 'Robin Hood Army (Kochi)', contact: '+91 98460 22334', upi: 'rha.kochi@icici', distance: '8 km' }
                    ],
                    reliefCamps: [
                        { name: 'Aluva Municipal Town Hall Shelter', address: 'Periyar Riverside, Aluva', capacity: '600 persons', neededPortions: 650 }
                    ]
                },
                // West Bengal (70-74)
                '70': {
                    state: 'West Bengal',
                    region: 'Kolkata & Hooghly Estuary',
                    disasterType: 'Ganga-Hooghly High Tide Tidal Surge & Urban Flood',
                    severity: 'High Priority Alert',
                    severityColor: '#ea580c',
                    distanceKm: 10,
                    distanceBadge: '~10 km from your kitchen',
                    incidentDescription: 'Cyclonic pressure in Bay of Bengal brought heavy tidal inundation in lowlands along Hooghly riverbank (Behala, Khidderpore, Howrah). 1,800+ families relocated.',
                    affectedPeople: '1,800+ displaced persons',
                    urgentlyNeeded: 'Hot cooked meal packets (Khichuri, Chholar Dal, Roti), water pouches, dry puffed rice (Muri)',
                    coordinatingAgency: 'West Bengal Disaster Management Dept & KMC Disaster Cell',
                    verifiedNgos: [
                        { name: 'Robin Hood Army (Kolkata Chapter)', contact: '+91 98300 12345', upi: 'rha.kolkata@icici', distance: '4.8 km' },
                        { name: 'Akshaya Patra Foundation (Kolkata Mega Kitchen)', contact: '+91 33 2400 1234', upi: 'akshayapatra.wb@sbi', distance: '7.5 km' },
                        { name: 'Goonj Kolkata Processing Hub', contact: '+91 33 2498 7654', upi: 'goonj.wb@hdfc', distance: '11.0 km' },
                        { name: 'Indian Red Cross Society (West Bengal Branch)', contact: '+91 33 2212 0154', upi: 'redcross.wb@sbi', distance: '6.5 km' }
                    ],
                    reliefCamps: [
                        { name: 'Behala Municipal Relief Hall #3', address: 'Diamond Harbour Road Shelter', capacity: '650 persons', neededPortions: 700 },
                        { name: 'Howrah Riverbank Evacuation Center', address: 'Foreshore Road Relief Site', capacity: '600 persons', neededPortions: 650 },
                        { name: 'Khidderpore Community Transit Shelter', address: 'Port Area Relief Point', capacity: '450 persons', neededPortions: 500 }
                    ]
                },
                // Odisha (75-77)
                '75': {
                    state: 'Odisha',
                    region: 'Bhubaneswar, Cuttack & Mahanadi Delta',
                    disasterType: 'Mahanadi Basin High Discharge & Cyclone Alert',
                    severity: 'Critical Flood Red Alert',
                    severityColor: '#dc2626',
                    distanceKm: 19,
                    distanceBadge: '~19 km away',
                    incidentDescription: 'Hirakud dam release flooded downstream delta islands and lowlands in Cuttack & Banki. 2,500+ residents evacuated to multipurpose cyclone & flood shelters.',
                    affectedPeople: '2,500+ evacuated persons',
                    urgentlyNeeded: 'Cooked hot meals (Dalma, Rice, Khichdi), drinking water cans, halogen tablets, dry food packets (Chuda/Guda)',
                    coordinatingAgency: 'Odisha State Disaster Management Authority (OSDMA) & ODRAF',
                    verifiedNgos: [
                        { name: 'Akshaya Patra Foundation (Puri-Bhubaneswar Hub)', contact: '+91 674 238 1234', upi: 'akshayapatra.odisha@sbi', distance: '6.5 km' },
                        { name: 'Robin Hood Army (Bhubaneswar Chapter)', contact: '+91 94370 12345', upi: 'rha.bbsr@icici', distance: '8.0 km' },
                        { name: 'Red Cross Society (Odisha State Branch)', contact: '+91 674 239 5245', upi: 'redcross.odisha@sbi', distance: '7.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Cuttack Mahanadi Embankment Shelter #2', address: 'Jobra Relief Site', capacity: '850 persons', neededPortions: 900 },
                        { name: 'Bhubaneswar North Multipurpose Flood Center', address: 'Patia Relief Hall', capacity: '650 persons', neededPortions: 700 }
                    ]
                },
                // Assam (78)
                '78': {
                    state: 'Assam',
                    region: 'Brahmaputra Valley & Guwahati / Kaziranga Sector',
                    disasterType: 'Brahmaputra Severe Flooding & Wildlife Corridor Inundation',
                    severity: 'Catastrophic Flood Red Alert',
                    severityColor: '#dc2626',
                    distanceKm: 21,
                    distanceBadge: '~21 km away',
                    incidentDescription: 'Brahmaputra and 12 major tributaries flowing above danger level across 18 districts. 3,800+ displaced families sheltered in highlands & school relief camps.',
                    affectedPeople: '3,800+ families & flood-affected persons',
                    urgentlyNeeded: 'Hot cooked nutritious meals (Rice, Dal, Veg Curry), water purification sachets, dry puffed rice, baby milk',
                    coordinatingAgency: 'Assam State Disaster Management Authority (ASDMA) & NDRF 1st Bn',
                    verifiedNgos: [
                        { name: 'Akshaya Patra Foundation (Guwahati Mega Kitchen)', contact: '+91 361 246 1234', upi: 'akshayapatra.assam@sbi', distance: '7.2 km' },
                        { name: 'Robin Hood Army (Guwahati Chapter)', contact: '+91 94350 55667', upi: 'rha.guwahati@icici', distance: '8.5 km' },
                        { name: 'Goonj Assam Relief Processing Center', contact: '+91 361 280 4455', upi: 'goonj.assam@hdfc', distance: '12.0 km' },
                        { name: 'Red Cross Society (Assam State Branch)', contact: '+91 361 254 3456', upi: 'redcross.assam@sbi', distance: '9.0 km' }
                    ],
                    reliefCamps: [
                        { name: 'Guwahati West Riverbank Relief Shelter', address: 'Pandu Relief Camp #3', capacity: '1,100 persons', neededPortions: 1200 },
                        { name: 'Kamrup District Emergency Evacuation Camp', address: 'Sonapur Highland Shelter', capacity: '900 persons', neededPortions: 950 },
                        { name: 'Kaziranga Buffer Zone Relief Station', address: 'Bokakhat Relief Hall', capacity: '750 persons', neededPortions: 800 }
                    ]
                },
                // Bihar (80-85)
                '80': {
                    state: 'Bihar',
                    region: 'Patna & Ganga-Gandak Confluence',
                    disasterType: 'Ganga-Son River Basin High Discharge & Inundation',
                    severity: 'High Flood Priority',
                    severityColor: '#dc2626',
                    distanceKm: 15,
                    distanceBadge: '~15 km away',
                    incidentDescription: 'Ganga river entered Digha, Maner & Danapur lowlands. 2,200+ villagers evacuated to flood relief camps.',
                    affectedPeople: '2,200+ displaced persons',
                    urgentlyNeeded: 'Nutritious hot meal packets (Khichdi, Dal Bhaat), dry Chura-Gur packets, safe drinking water',
                    coordinatingAgency: 'Bihar State Disaster Management Authority (BSDMA) & SDRF',
                    verifiedNgos: [
                        { name: 'Akshaya Patra Foundation (Patna Kitchen)', contact: '+91 612 250 1234', upi: 'akshayapatra.bihar@sbi', distance: '6.0 km' },
                        { name: 'Robin Hood Army (Patna Chapter)', contact: '+91 94310 11223', upi: 'rha.patna@icici', distance: '7.8 km' },
                        { name: 'Goonj Bihar Relief Hub', contact: '+91 612 245 8899', upi: 'goonj.bihar@hdfc', distance: '10.5 km' }
                    ],
                    reliefCamps: [
                        { name: 'Danapur Cantonment Flood Relief Camp #1', address: 'Danapur Station Road', capacity: '800 persons', neededPortions: 850 },
                        { name: 'Digha Pushta Community Relief Shelter', address: 'Patna West Relief Ground', capacity: '700 persons', neededPortions: 750 }
                    ]
                },
                '84': {
                    state: 'Bihar',
                    region: 'North Bihar (Kosi & Bagmati Basin / Darbhanga)',
                    disasterType: 'Kosi & Kamla Balan River Severe Inundation Crisis',
                    severity: 'Catastrophic Red Alert',
                    severityColor: '#dc2626',
                    distanceKm: 26,
                    distanceBadge: '~26 km away',
                    incidentDescription: 'High discharge from Kosi barrage breached embankments. 3,400+ villagers in temporary highway embankment camps.',
                    affectedPeople: '3,400+ displaced villagers',
                    urgentlyNeeded: 'Cooked hot meals, dry food packets, drinking water pouches, halogen tablets',
                    coordinatingAgency: 'Darbhanga District Disaster Management Unit & NDRF 9th Bn',
                    verifiedNgos: [
                        { name: 'Robin Hood Army (North Bihar Chapter)', contact: '+91 94300 22334', upi: 'rha.bihar@icici', distance: '12 km' },
                        { name: 'Red Cross Society (Darbhanga Branch)', contact: '+91 6272 222345', upi: 'redcross.drb@sbi', distance: '14 km' }
                    ],
                    reliefCamps: [
                        { name: 'Kosi Embankment Relief Camp #4', address: 'NH-57 Relief Sector', capacity: '1,200 persons', neededPortions: 1300 }
                    ]
                }
            };

            // Lookup by 2-digit prefix, then fallback to 1-digit zone
            let record = disasterDatabase[prefix2];
            if (!record) {
                const fallbackKeys = Object.keys(disasterDatabase).filter(k => k.startsWith(prefix1));
                if (fallbackKeys.length > 0) {
                    record = disasterDatabase[fallbackKeys[0]];
                }
            }

            // Fallback default to Karnataka / Bengaluru
            if (!record) {
                record = disasterDatabase['56'];
            }

            return {
                ...record,
                pincode: pin,
                matchedUserLocation: userLoc
            };
        },

        // ================= Supabase Database Synchronization Engine =================
        async syncFromDatabase(fssaiNumber) {
            const fssai = fssaiNumber || this.getSession()?.fssaiNumber;
            if (!fssai || typeof supabaseClient === 'undefined') {
                return { success: false, reason: 'No FSSAI or Supabase client available' };
            }

            try {
                // 1. Fetch Profile
                const { data: profile } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('fssai_number', fssai)
                    .maybeSingle();

                if (profile) {
                    this.setSession({
                        fssaiNumber: profile.fssai_number,
                        mobile: profile.mobile || '',
                        name: profile.full_name || 'Kitchen Operations Lead',
                        role: profile.role || 'Kitchen Unit Administrator',
                        kitchenName: profile.kitchen_name || 'Commercial Kitchen Facility',
                        address: profile.location ? `${profile.location} - ${profile.pincode || ''}` : '',
                        facilityId: profile.facility_id || 'Facility #1',
                        avatarId: profile.avatar_id || 'chef-mia'
                    });
                }

                // 2. Fetch Kitchen Settings
                const { data: settings } = await supabaseClient
                    .from('kitchen_settings')
                    .select('*')
                    .eq('fssai_number', fssai)
                    .maybeSingle();

                if (settings) {
                    this.saveKitchenSettings({
                        kitchenName: settings.kitchen_name,
                        managerName: settings.manager_name,
                        status: settings.status || 'open',
                        dailySummaryMode: settings.daily_summary_mode || 'auto',
                        defaultMealSizeGrams: parseFloat(settings.default_meal_size_grams) || 350,
                        targetBufferPct: parseFloat(settings.target_buffer_pct) || 8,
                        costPerMeal: parseFloat(settings.cost_per_meal) || 35.00,
                        pricePerMeal: parseFloat(settings.price_per_meal) || 50.00,
                        openingTime: settings.opening_time || '06:00',
                        closingTime: settings.closing_time || '22:00'
                    });
                }

                // 3. Fetch Daily Logs
                const { data: logs } = await supabaseClient
                    .from('daily_meal_logs')
                    .select('*')
                    .eq('fssai_number', fssai)
                    .order('created_at', { ascending: false })
                    .limit(24);

                if (logs && logs.length > 0) {
                    const formattedLogs = logs.map(l => ({
                        id: l.id,
                        date: l.date,
                        shift: l.shift,
                        weather: l.weather || 'Normal',
                        event: l.event || 'None',
                        attendance: l.attendance || 0,
                        attendanceSource: l.attendance_source || 'AI',
                        foodMade: l.food_made,
                        foodConsumed: l.food_consumed,
                        surplus: l.surplus,
                        foodRedistributed: l.food_redistributed,
                        waste: l.waste,
                        costPerMeal: parseFloat(l.cost_per_meal) || 25,
                        pricePerMeal: parseFloat(l.price_per_meal) || 35,
                        totalRevenue: parseFloat(l.total_revenue) || 0,
                        totalCost: parseFloat(l.total_cost) || 0,
                        profit: parseFloat(l.profit) || 0,
                        co2Saved: parseFloat(l.co2_saved) || 0,
                        avoidedCo2Total: parseFloat(l.co2_saved) || 0
                    }));
                    this.saveHistory(formattedLogs);
                } else {
                    this.saveHistory([]);
                }

                // 4. Fetch Redistributed Items
                const { data: redistItems } = await supabaseClient
                    .from('redistributions')
                    .select('*')
                    .eq('fssai_number', fssai)
                    .order('created_at', { ascending: false })
                    .limit(15);

                if (redistItems && redistItems.length > 0) {
                    const formattedRedist = redistItems.map(r => ({
                        id: r.id,
                        date: r.date,
                        shift: r.shift,
                        ngo: r.ngo_name,
                        contactPerson: r.contact_person,
                        phone: r.phone,
                        portions: r.portions_donated,
                        foodType: r.food_type,
                        time: r.pickup_time,
                        temp: r.temperature_celsius ? `${r.temperature_celsius}°C` : '65°C',
                        fssaiVerified: r.fssai_verified,
                        status: r.status
                    }));
                    this.saveRedistribution(formattedRedist);
                } else {
                    this.saveRedistribution([]);
                }

                return { success: true };
            } catch (err) {
                console.warn('Database sync notice:', err);
                return { success: false, error: err };
            }
        },

        async saveMealLogAsync(newLog) {
            this.addDailyLog(newLog);

            const fssai = this.getSession()?.fssaiNumber;
            if (fssai && typeof supabaseClient !== 'undefined') {
                try {
                    const shiftName = newLog.shift || 'Lunch';
                    const payload = {
                        weather: newLog.weather || 'Sunny',
                        event: newLog.event || 'None',
                        attendance: parseInt(newLog.attendance) || 0,
                        attendance_source: newLog.attendanceSource || 'AI',
                        food_made: parseInt(newLog.foodMade) || 0,
                        food_consumed: parseInt(newLog.foodConsumed) || 0,
                        surplus: parseInt(newLog.surplus) || 0,
                        food_redistributed: parseInt(newLog.foodRedistributed) || 0,
                        waste: parseInt(newLog.waste) || 0,
                        cost_per_meal: parseFloat(newLog.costPerMeal) || 25,
                        price_per_meal: parseFloat(newLog.pricePerMeal) || 35,
                        total_revenue: parseFloat(newLog.totalRevenue) || 0,
                        total_cost: parseFloat(newLog.totalCost) || 0,
                        profit: parseFloat(newLog.profit) || 0,
                        co2_saved: parseFloat(newLog.co2Saved || newLog.avoidedCo2Total) || 0
                    };

                    const { data: existing } = await supabaseClient
                        .from('daily_meal_logs')
                        .select('id')
                        .eq('fssai_number', fssai)
                        .eq('date', newLog.date)
                        .eq('shift', shiftName)
                        .maybeSingle();

                    if (existing && existing.id) {
                        await supabaseClient
                            .from('daily_meal_logs')
                            .update(payload)
                            .eq('id', existing.id);
                    } else {
                        await supabaseClient
                            .from('daily_meal_logs')
                            .insert([{
                                ...payload,
                                fssai_number: fssai,
                                date: newLog.date,
                                shift: shiftName
                            }]);
                    }
                } catch (e) {
                    console.warn('Could not save meal log to database:', e);
                }
            }
        },

        async saveRedistributionAsync(entry) {
            this.addRedistribution(entry);

            const fssai = this.getSession()?.fssaiNumber;
            if (fssai && typeof supabaseClient !== 'undefined') {
                try {
                    await supabaseClient.from('redistributions').insert([{
                        fssai_number: fssai,
                        date: entry.date || new Date().toISOString().slice(0, 10),
                        shift: entry.shift || 'Lunch',
                        ngo_name: entry.ngo || entry.ngoName || 'Akshaya Patra / Feeding India',
                        contact_person: entry.contactPerson || 'Operations Coordinator',
                        phone: entry.phone || '9876543210',
                        portions_donated: parseInt(entry.portions || entry.quantity || 0),
                        food_type: entry.foodType || 'Fresh Cooked Meals',
                        pickup_time: entry.time || entry.pickupTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        temperature_celsius: parseFloat(entry.temp) || 65.0,
                        fssai_verified: entry.fssaiVerified !== false,
                        status: entry.status || 'Completed'
                    }]);
                } catch (e) {
                    console.warn('Could not save redistribution to database:', e);
                }
            }
        },

        async saveForecastTargetAsync(targetObj) {
            this.setTarget(targetObj);

            const fssai = this.getSession()?.fssaiNumber;
            if (fssai && typeof supabaseClient !== 'undefined') {
                try {
                    const shiftName = targetObj.mealType || targetObj.shift || 'Lunch';
                    const targetDate = targetObj.date || new Date().toISOString().slice(0, 10);
                    const forecastPayload = {
                        predicted_portions: parseInt(targetObj.portions || 0),
                        planned_attendance: parseInt(targetObj.attendance || 0),
                        buffer_percentage: parseFloat(targetObj.bufferPct || 8),
                        weather_condition: targetObj.weather || 'Sunny',
                        event_type: targetObj.event || 'None',
                        ingredients_json: {
                            riceKg: targetObj.riceKg,
                            dalKg: targetObj.dalKg,
                            vegKg: targetObj.vegKg,
                            oilL: targetObj.oilL,
                            flourKg: targetObj.flourKg,
                            chapatis: targetObj.chapatis
                        },
                        status: 'Scheduled'
                    };

                    const { data: existingForecast } = await supabaseClient
                        .from('meal_forecasts')
                        .select('id')
                        .eq('fssai_number', fssai)
                        .eq('date', targetDate)
                        .eq('shift', shiftName)
                        .maybeSingle();

                    if (existingForecast && existingForecast.id) {
                        await supabaseClient
                            .from('meal_forecasts')
                            .update(forecastPayload)
                            .eq('id', existingForecast.id);
                    } else {
                        await supabaseClient
                            .from('meal_forecasts')
                            .insert([{
                                ...forecastPayload,
                                fssai_number: fssai,
                                date: targetDate,
                                shift: shiftName
                            }]);
                    }
                } catch (e) {
                    console.warn('Could not save forecast to database:', e);
                }
            }
        },

        async saveAllDayForecastsAsync(forecastList) {
            if (!forecastList || !forecastList.length) return;

            // Cache in local storage
            const targetDate = forecastList[0].date;
            setItem(`foodsafe_all_forecasts_${targetDate}`, forecastList);

            const fssai = this.getSession()?.fssaiNumber;
            if (fssai && typeof supabaseClient !== 'undefined') {
                try {
                    for (const targetObj of forecastList) {
                        const shiftName = targetObj.mealType || targetObj.shift || 'Lunch';
                        const fDate = targetObj.date || targetDate;
                        const forecastPayload = {
                            predicted_portions: parseInt(targetObj.portions || 0),
                            planned_attendance: parseInt(targetObj.attendance || 0),
                            buffer_percentage: parseFloat(targetObj.bufferPct || 8),
                            weather_condition: targetObj.weather || 'Sunny',
                            event_type: targetObj.event || 'None',
                            ingredients_json: {
                                riceKg: targetObj.riceKg,
                                dalKg: targetObj.dalKg,
                                vegKg: targetObj.vegKg,
                                oilL: targetObj.oilL,
                                flourKg: targetObj.flourKg,
                                chapatis: targetObj.chapatis
                            },
                            status: 'Scheduled'
                        };

                        const { data: existing } = await supabaseClient
                            .from('meal_forecasts')
                            .select('id')
                            .eq('fssai_number', fssai)
                            .eq('date', fDate)
                            .eq('shift', shiftName)
                            .maybeSingle();

                        if (existing && existing.id) {
                            await supabaseClient
                                .from('meal_forecasts')
                                .update(forecastPayload)
                                .eq('id', existing.id);
                        } else {
                            await supabaseClient
                                .from('meal_forecasts')
                                .insert([{
                                    ...forecastPayload,
                                    fssai_number: fssai,
                                    date: fDate,
                                    shift: shiftName
                                }]);
                        }
                    }
                } catch (e) {
                    console.warn('Could not save all-day forecasts to database:', e);
                }
            }
        },

        async saveKitchenSettingsAsync(settings) {
            this.saveKitchenSettings(settings);

            const fssai = this.getSession()?.fssaiNumber;
            if (fssai && typeof supabaseClient !== 'undefined') {
                try {
                    await supabaseClient
                        .from('kitchen_settings')
                        .upsert([{
                            fssai_number: fssai,
                            kitchen_name: settings.kitchenName || 'Commercial Kitchen Facility',
                            manager_name: settings.managerName || 'Chef Manager',
                            status: settings.status || 'open',
                            daily_summary_mode: settings.dailySummaryMode || 'auto',
                            default_meal_size_grams: parseFloat(settings.defaultMealSizeGrams) || 350,
                            target_buffer_pct: parseFloat(settings.targetBufferPct) || 8,
                            cost_per_meal: parseFloat(settings.costPerMeal) || 35.00,
                            price_per_meal: parseFloat(settings.pricePerMeal) || 50.00,
                            opening_time: settings.openingTime || '06:00',
                            closing_time: settings.closingTime || '22:00'
                        }], { onConflict: 'fssai_number' });

                    if (settings.kitchenName || settings.managerName) {
                        await supabaseClient
                            .from('profiles')
                            .update({
                                kitchen_name: settings.kitchenName,
                                full_name: settings.managerName
                            })
                            .eq('fssai_number', fssai);
                    }
                } catch (e) {
                    console.warn('Could not save settings to database:', e);
                }
            }
        },

        // ================= Supabase Realtime Synchronization =================
        initRealtimeSubscriptions() {
            const fssai = this.getSession()?.fssaiNumber;
            if (!fssai || typeof supabaseClient === 'undefined') {
                return;
            }

            // Unsubscribe from existing channels if any
            if (this.realtimeChannel) {
                supabaseClient.removeChannel(this.realtimeChannel);
            }

            this.realtimeChannel = supabaseClient.channel(`public:all_foodsafe_tables:${fssai}`);

            const handlePayload = (payload) => {
                console.log('Realtime update received!', payload);
                // Trigger a fetch to refresh data and dispatch event
                this.syncFromDatabase(fssai).then(() => {
                    window.dispatchEvent(new CustomEvent('foodsafe-data-updated', { detail: payload }));
                });
            };

            this.realtimeChannel
                .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_meal_logs', filter: `fssai_number=eq.${fssai}` }, handlePayload)
                .on('postgres_changes', { event: '*', schema: 'public', table: 'redistributions', filter: `fssai_number=eq.${fssai}` }, handlePayload)
                .on('postgres_changes', { event: '*', schema: 'public', table: 'meal_forecasts', filter: `fssai_number=eq.${fssai}` }, handlePayload)
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        console.log(`Subscribed to realtime changes for FSSAI: ${fssai}`);
                    }
                });
        },

        // ================= UI Toast Notifications =================
        toast(message, type = 'info', duration = 3500) {
            let container = document.getElementById('foodsafe-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'foodsafe-toast-container';
                container.style.cssText = `
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 99999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    pointer-events: none;
                `;
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = `foodsafe-toast toast-${type}`;
            
            let iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#187F87" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
            let bg = '#071517';
            let border = '#187F87';
            let color = '#f8fafc';

            if (type === 'success') {
                iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
                bg = '#0f172a';
                border = '#16a34a';
            } else if (type === 'danger' || type === 'error') {
                iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
                bg = '#0f172a';
                border = '#dc2626';
            } else if (type === 'warning') {
                iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
                bg = '#0f172a';
                border = '#d97706';
            }

            toast.style.cssText = `
                background: ${bg};
                color: ${color};
                border: 1px solid ${border};
                border-left: 4px solid ${border};
                padding: 12px 18px;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.25);
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                font-size: 0.88rem;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 260px;
                max-width: 420px;
                pointer-events: auto;
                animation: foodsafeSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                transition: all 0.3s ease;
            `;

            toast.innerHTML = `
                <div style="flex-shrink: 0; display: flex; align-items: center;">${iconSvg}</div>
                <div style="flex-grow: 1;">${message}</div>
            `;

            container.appendChild(toast);

            // Keep maximum of 3 toasts visible at a time to prevent clutter
            while (container.children.length > 3) {
                container.removeChild(container.firstChild);
            }

            // Reduced duration for faster clearance
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    if (toast.parentNode) toast.parentNode.removeChild(toast);
                }, 300);
            }, Math.min(duration, 2500));
        },

        // ================= Export Utilities =================
        exportToCSV(filename, headers, rows) {
            const csvContent = "data:text/csv;charset=utf-8," + [
                headers.map(h => `"${h}"`).join(","),
                ...rows.map(row => row.map(cell => `"${(cell !== null && cell !== undefined ? cell.toString().replace(/"/g, '""') : '')}"`).join(","))
            ].join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.toast(`Exported "${filename}.csv" successfully!`, 'success');
        },

        exportToJSON(filename, data) {
            const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
            const link = document.createElement("a");
            link.setAttribute("href", jsonStr);
            link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.json`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.toast(`Exported "${filename}.json" successfully!`, 'success');
        },

        // ================= Number & Currency Formatters =================
        formatINR(amount) {
            return '₹' + (parseFloat(amount) || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        },

        formatKg(weight) {
            return (parseFloat(weight) || 0).toFixed(1) + ' kg';
        },

        formatCO2(kgCo2) {
            return '+' + (parseFloat(kgCo2) || 0).toFixed(1) + ' kg CO2e';
        }
    };

    // Auto-init theme on script evaluation and DOMContentLoaded
    FoodSafe.initTheme();
    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', () => {
            FoodSafe.initTheme();
        });
    }

    // Sync theme & settings across tabs and schedule periodic time-based kitchen status checker
    if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
            if (e.key === FoodSafe.KEYS.THEME) {
                FoodSafe.initTheme();
            }
            if (e.key === FoodSafe.KEYS.KITCHEN_SETTINGS) {
                window.dispatchEvent(new CustomEvent('foodsafe-settings-change', { detail: FoodSafe.getKitchenSettings() }));
            }
        });

        // Periodic ticker to check date/time status transitions every 30 seconds
        setInterval(() => {
            try {
                FoodSafe.checkAndUpdateKitchenStatus();
            } catch (err) {
                // silent
            }
        }, 30000);
    }

    // Inject Toast Keyframes Animation
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @keyframes foodsafeSlideIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleEl);

    // Expose globally as MealLoop, Foodagement and FoodSafe alias
    global.MealLoop = FoodSafe;
    global.Foodagement = FoodSafe;
    global.FoodSafe = FoodSafe;

})(typeof window !== 'undefined' ? window : this);
