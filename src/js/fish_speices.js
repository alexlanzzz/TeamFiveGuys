// Step 1: Fetch the class names
function fetchClassNames() {
    const classNamesUrl = 'https://apps.des.qld.gov.au/species/?op=getclassnames&kingdom=animals';

    $.ajax({
        url: classNamesUrl,
        dataType: 'json',
        success: function(response) {
            console.log(response);  // Inspect the structure of the response
    
            // Access the 'Class' array inside the response object
            const fishClasses = response.Class.filter(item => item.ClassCommonName.toLowerCase().includes("fishes"));
            
            console.log('Fish Classes:', fishClasses);

            // Now process each class
            fishClasses.forEach(fishClass => {
                fetchFamilyNames(fishClass.FamilyNamesUrl);
            });
        },
        error: function(error) {
            console.log("Error fetching class names:", error);
        }
    });
}

// Step 2: Fetch the family names for each class
function fetchFamilyNames(familyNamesUrl) {
    $.ajax({
        url: familyNamesUrl,
        dataType: 'json',
        success: function(response) {
            console.log('Family Names:', response);  // Log the response to inspect its structure

            // Access the array within the response (adjust this depending on the structure)
            const families = response.Family || response.FamilyNames || response;  // Adapt to actual response format

            if (Array.isArray(families)) {
                families.forEach(family => {
                    fetchSpeciesInformation(family.SpeciesUrl);
                });
            } else {
                console.error("Expected an array of families but got something else", families);
            }
        },
        error: function(error) {
            console.log("Error fetching family names:", error);
        }
    });
}

// Step 3: Fetch species information for each family
function fetchSpeciesInformation(speciesUrl) {
    $.ajax({
        url: speciesUrl,
        dataType: 'json',
        success: function(response) {
            console.log('Species Information:', response);

            // Display or process species data as needed
            displaySpeciesInfo(response);
        },
        error: function(error) {
            console.log("Error fetching species information:", error);
        }
    });
}

// Display the fetched species information
function displaySpeciesInfo(speciesData) {
    console.log("Species Data: ", speciesData);  // Log to inspect the structure

    // Access the array inside the response object
    const speciesArray = speciesData.Species || speciesData;  // Adapt based on actual structure

    if (Array.isArray(speciesArray)) {
        let htmlContent = '<h2>Species Information</h2>';
        speciesArray.forEach(species => {
            htmlContent += `<p><strong>Species:</strong> ${species.ScientificName} <br>
                            <strong>Common Name:</strong> ${species.AcceptedCommonName} <br>
                            <strong>Conservation Status:</strong> ${species.ConservationStatus.ConservationSignificant ? "Conservation Significant" : "Not Conservation Significant"} <br>
                            <strong>Environment:</strong> ${species.SpeciesEnvironment} <br>
                            <strong>Profile:</strong> <a href="${species.SpeciesProfileUrl}" target="_blank">View Profile</a>
                            </p><hr>`;
        });
        $('#species-info-container').html(htmlContent);
    } else {
        console.error("Expected an array of species, but got:", speciesArray);
    }
}

// Initialize the chain of API requests
fetchClassNames();