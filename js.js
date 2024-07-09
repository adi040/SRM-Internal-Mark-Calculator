document.addEventListener("DOMContentLoaded", function () {
    const inputFields = document.getElementById("input-fields");
    const resultsDiv = document.getElementById("results");

    // Function to navigate to a new page
    function navigateToPage(page) {
        window.location.href = page;
    }

    // Function to toggle the side menu
    function toggleMenu() {
        const sideMenu = document.getElementById('side-menu');
        if (sideMenu.style.left === '-250px' || !sideMenu.style.left) {
            sideMenu.style.left = '0';
        } else {
            sideMenu.style.left = '-250px';
        }
    }
    document.addEventListener('click', function(event) {
        const sideMenu = document.getElementById('side-menu');
        const menuToggle = document.getElementById('menu-toggle');
        if (sideMenu && menuToggle && !menuToggle.contains(event.target) && !sideMenu.contains(event.target)) {
            sideMenu.style.left = '-250px';
        }
    });

    // Expose functions to global scope
    window.toggleMenu = toggleMenu;
    window.navigateToPage = navigateToPage;

    // Add event listener to the home button
    const homeButton = document.getElementById("home-button");
    if (homeButton) {
        homeButton.addEventListener("click", function () {
            navigateToPage("index.html");
        });
    }

    // Helper function to get URL parameters
    function getQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            regulation: urlParams.get('regulation'),
            course: urlParams.get('course')
        };
    }

    // Handle input fields display based on URL parameters
    function handleInputFields() {
        const params = getQueryParams();
        if (params.regulation === '2018') {
            if (params.course === 'theory') {
                inputFields.innerHTML = `
                    <label for="ct1">Cycle Test 1 (25 Marks):</label>
                    <input type="number" id="ct1" max="25" min="0" required>
                    <label for="ct2">Cycle Test 2 (50 Marks):</label>
                    <input type="number" id="ct2" max="50" min="0" required>
                    <label for="ct3">Cycle Test 3 (50 Marks):</label>
                    <input type="number" id="ct3" max="50" min="0" required>
                    <label for="ct4">Cycle Test 4 (10 Marks):</label>
                    <input type="number" id="ct4" max="10" min="0" required>
                `;
            } else if (params.course === 'joint') {
                inputFields.innerHTML = `
                    <label for="ct1">Cycle Test 1 (10%):</label>
                    <input type="number" id="ct1" max="10" min="0" required>
                    <label for="ct2">Cycle Test 2 (15%):</label>
                    <input type="number" id="ct2" max="15" min="0" required>
                    <label for="ct3">Cycle Test 3 (15%):</label>
                    <input type="number" id="ct3" max="15" min="0" required>
                    <label for="ct4">Cycle Test 4 (10%):</label>
                    <input type="number" id="ct4" max="10" min="0" required>
                    <label for="practical-lab">Lab Practical (25%):</label>
                    <input type="number" id="practical-lab" max="25" min="0" required>
                `;
            }
        } else if (params.regulation === '2021') {
            if (params.course === 'theory') {
                inputFields.innerHTML = `
                    <label for="ct1">Cycle Test 1 (50 Marks):</label>
                    <input type="number" id="ct1" max="50" min="0" required>
                    <label for="ct2">Cycle Test 2 (50 Marks):</label>
                    <input type="number" id="ct2" max="50" min="0" required>
                `;
            } else if (params.course === 'joint') {
                inputFields.innerHTML = `
                    <label for="ct1">Cycle Test 1 (30%):</label>
                    <input type="number" id="ct1" max="30" min="0" required>
                    <label for="ct2">Cycle Test 2 (30%):</label>
                    <input type="number" id="ct2" max="30" min="0" required>
                    <label for="practical">Practical (40%):</label>
                    <input type="number" id="practical" max="40" min="0" required>
                `;
            }
        }
    }

    // Initialize the input fields based on the current page
    if (inputFields) {
        handleInputFields();
    }

    // Function to validate inputs
    function validateInputs(inputs) {
        for (let i = 0; i < inputs.length; i++) {
            const value = parseFloat(inputs[i].value);
            if (isNaN(value) || value < 0 || value > parseFloat(inputs[i].max)) {
                return false;
            }
        }
        return true;
    }

    // Function to scroll to results section
    function scrollToResults() {
        resultsDiv.scrollIntoView({ behavior: "smooth" });
    }

    // Calculate marks function
    window.calculateMarks = function () {
        const params = getQueryParams();
        let totalInternal = 0;

        const inputs = document.querySelectorAll('#input-fields input');
        if (!validateInputs(inputs)) {
            resultsDiv.innerHTML = "<p>Please enter valid values for all fields.</p>";
            resultsDiv.style.display = "block";
            scrollToResults();
            return;
        }

        if (params.regulation === '2018' && params.course === 'theory') {
            const ct1 = parseFloat(document.getElementById('ct1').value) || 0;
            const ct2 = parseFloat(document.getElementById('ct2').value) || 0;
            const ct3 = parseFloat(document.getElementById('ct3').value) || 0;
            const ct4 = parseFloat(document.getElementById('ct4').value) || 0;
            totalInternal = (ct1 / 2.5) + (ct2 / 3.333333333333333) + (ct3 / 3.333333333333333) + ct4;
        } else if (params.regulation === '2021' && params.course === 'theory') {
            const ct1 = parseFloat(document.getElementById('ct1').value) || 0;
            const ct2 = parseFloat(document.getElementById('ct2').value) || 0;
            totalInternal = ct1 + (ct2 / 5);
        } else {
            inputs.forEach(input => {
                totalInternal += parseFloat(input.value) || 0;
            });
        }

        const grades = [
            { grade: 'O', marks: 91 },
            { grade: 'A+', marks: 81 },
            { grade: 'A', marks: 71 },
            { grade: 'B+', marks: 61 },
            { grade: 'B', marks: 56 },
            { grade: 'C', marks: 50 },
        ];

        let resultHTML = `
            <h2>Results</h2>
            <p>Total Internal Marks: ${totalInternal.toFixed(2)}</p>
        `;

        if (params.regulation === '2018') {
            const weightage = params.course === 'theory' ? 2 : 4;

            grades.forEach(grade => {
                const requiredMarks = (grade.marks - totalInternal) * weightage;
                if (requiredMarks > 0) {
                    if (requiredMarks > 100) {
                        resultHTML += `<p>Required External Marks for ${grade.grade} Grade: Not possible</p>`;
                    } else {
                        resultHTML += `<p>Required External Marks for ${grade.grade} Grade: ${requiredMarks.toFixed(2)}</p>`;
                    }
                }
            });
        } else if (params.regulation === '2021') {
            const weightage = params.course === 'theory' ? 2 : 1;

            if (params.course === 'theory') {
                grades.forEach(grade => {
                    const requiredMarks = (grade.marks - totalInternal) * weightage;
                    if (requiredMarks > 0) {
                        if (requiredMarks > 100) {
                            resultHTML += `<p>Required Marks for ${grade.grade} Grade: Not possible</p>`;
                        } else {
                            resultHTML += `<p>Required Marks for ${grade.grade} Grade: ${requiredMarks.toFixed(2)}</p>`;
                        }
                    }
                });
            } else {
                let gradeObtained = 'F';
                if (totalInternal >= 91) {
                    gradeObtained = 'O';
                } else if (totalInternal >= 81) {
                    gradeObtained = 'A+';
                } else if (totalInternal >= 71) {
                    gradeObtained = 'A';
                } else if (totalInternal >= 61) {
                    gradeObtained = 'B+';
                } else if (totalInternal >= 56) {
                    gradeObtained = 'B';
                } else if (totalInternal >= 50) {
                    gradeObtained = 'C';
                }

                resultHTML += `<p>Your Grade: ${gradeObtained}</p>`;
            }
        }

        resultsDiv.innerHTML = resultHTML;
        resultsDiv.style.display = "block";
        scrollToResults();
    };

    // Initialize the input fields based on the current page
    if (inputFields) {
        handleInputFields();
    }
});
