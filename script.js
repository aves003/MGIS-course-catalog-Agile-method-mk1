// RIT Course Catalog Application
let allCourses = [];
let filteredCourses = [];

// Initialize the application
async function init() {
    try {
        await loadCourses();
        populateDepartmentFilter();
        setupEventListeners();
        displayCourses(allCourses);
        updateCount(allCourses.length);
    } catch (error) {
        console.error('Error initializing application:', error);
        showError();
    }
}

// Load courses from JSON file
async function loadCourses() {
    try {
        const response = await fetch('rit_courses.json');
        const data = await response.json();
        allCourses = data.courses;
        filteredCourses = [...allCourses];
    } catch (error) {
        throw new Error('Failed to load courses');
    }
}

// Populate department dropdown with unique departments
function populateDepartmentFilter() {
    const departmentSelect = document.getElementById('department');
    const departments = [...new Set(allCourses.map(course => course.department))].sort();
    
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        departmentSelect.appendChild(option);
    });
}

// Setup event listeners for filters
function setupEventListeners() {
    const searchInput = document.getElementById('search');
    const departmentSelect = document.getElementById('department');
    const levelSelect = document.getElementById('level');
    
    searchInput.addEventListener('input', applyFilters);
    departmentSelect.addEventListener('change', applyFilters);
    levelSelect.addEventListener('change', applyFilters);
}

// Apply all filters
function applyFilters() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const selectedDepartment = document.getElementById('department').value;
    const selectedLevel = document.getElementById('level').value;
    
    filteredCourses = allCourses.filter(course => {
        // Search filter
        const matchesSearch = !searchTerm || 
            course.courseCode.toLowerCase().includes(searchTerm) ||
            course.title.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm);
        
        // Department filter
        const matchesDepartment = !selectedDepartment || 
            course.department === selectedDepartment;
        
        // Level filter
        const matchesLevel = !selectedLevel || 
            course.level >= parseInt(selectedLevel) && 
            course.level < parseInt(selectedLevel) + 100;
        
        return matchesSearch && matchesDepartment && matchesLevel;
    });
    
    displayCourses(filteredCourses);
    updateCount(filteredCourses.length);
}

// Display courses on the page
function displayCourses(courses) {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = '';
    
    if (courses.length === 0) {
        courseList.innerHTML = `
            <div class="no-results">
                <h3>No courses found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    courses.forEach(course => {
        const courseCard = createCourseCard(course);
        courseList.appendChild(courseCard);
    });
}

// Create a course card element
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    
    const termsHTML = course.terms.map(term => 
        `<span class="badge badge-term">${term}</span>`
    ).join('');
    
    const prereqsHTML = course.prerequisites.length > 0
        ? `<span class="badge badge-prereq">Prerequisites: ${course.prerequisites.join(', ')}</span>`
        : '<span class="badge badge-prereq">No Prerequisites</span>';
    
    card.innerHTML = `
        <div class="course-header">
            <span class="course-code">${course.courseCode}</span>
            <span class="course-credits">${course.credits} Credits</span>
        </div>
        <h2 class="course-title">${course.title}</h2>
        <div class="course-department">${course.department}</div>
        <p class="course-description">${course.description}</p>
        <div class="course-footer">
            <span class="badge badge-level">Level ${course.level}</span>
            ${termsHTML}
            ${prereqsHTML}
        </div>
    `;
    
    return card;
}

// Update course count
function updateCount(count) {
    document.getElementById('count').textContent = count;
}

// Show error message
function showError() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = `
        <div class="no-results">
            <h3>Error loading courses</h3>
            <p>Please refresh the page or contact support</p>
        </div>
    `;
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);