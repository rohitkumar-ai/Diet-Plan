// DOM Elements
const dietForm = document.getElementById('dietForm');
const resultsSection = document.getElementById('results');
const fullNameInput = document.getElementById('fullname');
const addressInput = document.getElementById('address');
const userNameDisplay = document.getElementById('user-name');
const userAddressDisplay = document.getElementById('user-address');
const caloriesResult = document.getElementById('calories-result');
const proteinResult = document.getElementById('protein-result');
const carbsResult = document.getElementById('carbs-result');
const fatResult = document.getElementById('fat-result');
const breakfastMeal = document.getElementById('breakfast-meal');
const lunchMeal = document.getElementById('lunch-meal');
const dinnerMeal = document.getElementById('dinner-meal');
const snacksMeal = document.getElementById('snacks-meal');

// Meal database
const mealDatabase = {
    balanced: {
        breakfast: "Scrambled eggs with whole wheat toast and avocado",
        lunch: "Grilled chicken with quinoa and roasted vegetables",
        dinner: "Baked salmon with sweet potato and steamed broccoli",
        snacks: "Greek yogurt with berries and almonds"
    },
    vegetarian: {
        breakfast: "Oatmeal with chia seeds, banana, and almond butter",
        lunch: "Lentil soup with whole grain bread and side salad",
        dinner: "Tofu stir-fry with brown rice and mixed vegetables",
        snacks: "Hummus with carrot and cucumber sticks"
    },
    vegan: {
        breakfast: "Smoothie bowl with plant protein, mango, and granola",
        lunch: "Chickpea salad wrap with avocado and spinach",
        dinner: "Vegetable curry with coconut milk and quinoa",
        snacks: "Mixed nuts and dried fruits"
    },
    keto: {
        breakfast: "Omelet with cheese, mushrooms, and spinach cooked in butter",
        lunch: "Bunless bacon cheeseburger with avocado and side salad",
        dinner: "Grilled steak with roasted Brussels sprouts and cauliflower mash",
        snacks: "Cheese cubes and olives"
    },
    mediterranean: {
        breakfast: "Greek yogurt with honey, walnuts, and figs",
        lunch: "Grilled fish with tabbouleh and roasted eggplant",
        dinner: "Chicken souvlaki with Greek salad and pita bread",
        snacks: "Feta cheese with cherry tomatoes"
    },
    paleo: {
        breakfast: "Sweet potato hash with eggs and turkey sausage",
        lunch: "Grilled chicken salad with avocado, nuts, and olive oil dressing",
        dinner: "Herb-roasted pork tenderloin with roasted root vegetables",
        snacks: "Hard-boiled eggs and fresh fruit"
    }
};

// Form submission handler
dietForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const fullName = fullNameInput.value.trim();
    const address = addressInput.value.trim();
    const age = parseInt(document.getElementById('age').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = document.getElementById('activity').value;
    const goal = document.getElementById('goal').value;
    const dietType = document.getElementById('diet-type').value;
    
    // Get allergies
    const allergyCheckboxes = document.querySelectorAll('input[name="allergies"]:checked');
    const allergies = Array.from(allergyCheckboxes).map(cb => cb.value);
    
    // Display user info
    userNameDisplay.textContent = fullName || "Not provided";
    userAddressDisplay.textContent = address || "Not provided";
    
    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Calculate BMR (Basal Metabolic Rate)
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Calculate TDEE (Total Daily Energy Expenditure) based on activity level
    let activityMultiplier;
    switch(activity) {
        case 'sedentary': activityMultiplier = 1.2; break;
        case 'light': activityMultiplier = 1.375; break;
        case 'moderate': activityMultiplier = 1.55; break;
        case 'active': activityMultiplier = 1.725; break;
        case 'extreme': activityMultiplier = 1.9; break;
        default: activityMultiplier = 1.55;
    }
    
    let tdee = bmr * activityMultiplier;
    
    // Adjust calories based on goal
    switch(goal) {
        case 'lose': tdee -= 500; break; // 500 calorie deficit for weight loss
        case 'gain': tdee += 500; break; // 500 calorie surplus for weight gain
    }
    
    // Calculate macronutrients (simplified)
    let protein, carbs, fat;
    
    switch(dietType) {
        case 'keto':
            protein = weight * 1.8; // Higher protein for keto
            fat = (tdee * 0.7) / 9; // 70% of calories from fat
            carbs = (tdee * 0.05) / 4; // 5% of calories from carbs
            break;
        case 'balanced':
            protein = weight * 1.6;
            fat = (tdee * 0.25) / 9;
            carbs = (tdee * 0.5) / 4;
            break;
        case 'vegetarian':
        case 'vegan':
            protein = weight * 1.4;
            fat = (tdee * 0.25) / 9;
            carbs = (tdee * 0.55) / 4;
            break;
        case 'mediterranean':
            protein = weight * 1.4;
            fat = (tdee * 0.35) / 9;
            carbs = (tdee * 0.45) / 4;
            break;
        case 'paleo':
            protein = weight * 1.8;
            fat = (tdee * 0.4) / 9;
            carbs = (tdee * 0.3) / 4;
            break;
        default:
            protein = weight * 1.6;
            fat = (tdee * 0.25) / 9;
            carbs = (tdee * 0.5) / 4;
    }
    
    // Adjust for allergies (simplified example)
    if (allergies.includes('dairy')) {
        // Modify meal plan to exclude dairy
        if (dietType === 'balanced') {
            mealDatabase.balanced.snacks = "Almond butter with apple slices";
        }
        if (dietType === 'vegetarian') {
            mealDatabase.vegetarian.snacks = "Hummus with vegetables";
        }
    }
    
    // Update results
    caloriesResult.textContent = Math.round(tdee);
    proteinResult.textContent = Math.round(protein);
    carbsResult.textContent = Math.round(carbs);
    fatResult.textContent = Math.round(fat);
    
    // Get meal plan
    const mealPlan = mealDatabase[dietType] || mealDatabase['balanced'];
    breakfastMeal.textContent = mealPlan.breakfast;
    lunchMeal.textContent = mealPlan.lunch;
    dinnerMeal.textContent = mealPlan.dinner;
    snacksMeal.textContent = mealPlan.snacks;
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
});

// Reset form function
function resetForm() {
    dietForm.reset();
    userNameDisplay.textContent = "User Name";
    userAddressDisplay.textContent = "User Address";
    resultsSection.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    // Set default values
    document.getElementById('age').value = 30;
    document.getElementById('weight').value = 70;
    document.getElementById('height').value = 170;
});