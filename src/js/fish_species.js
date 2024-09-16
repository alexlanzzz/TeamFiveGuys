// Function to ensure the URL starts with "https://"
function ensureHttpsUrl(url) {
    if (url.startsWith("http://")) {
        // Replace "http://" with "https://"
        return url.replace("http://", "https://");
    } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
        // If the URL does not start with either, prepend "https://"
        return "https://" + url;
    }
    return url;  // If it already starts with "https://", return as is
}

// Fetch the class names
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

// Fetch the family names for each class
function fetchFamilyNames(familyNamesUrl) {
    // Ensure "https://" is added only if it's not already in the URL
    familyNamesUrl = ensureHttpsUrl(familyNamesUrl);
    console.log('Family Names URL:', familyNamesUrl);

    $.ajax({
        url: familyNamesUrl,
        dataType: 'json',
        success: function(response) {
            console.log('Family Names:', response);  // Log the response to inspect its structure

            const families = response.Family || response.FamilyNames || response;

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

// Fetch species information for each family
function fetchSpeciesInformation(speciesUrl) {
    speciesUrl = ensureHttpsUrl(speciesUrl);
    console.log('Species URL:', speciesUrl);
    
    $.ajax({
        url: speciesUrl,
        dataType: 'json',
        success: function(response) {
            console.log('Species Information:', response);
            displaySpeciesInfo(response);
        },
        error: function(error) {
            console.log("Error fetching species information:", error);
        }
    });
}

// Display the fetched species information
function displaySpeciesInfo(speciesData) {
    console.log("Species Data (full): ", speciesData);  // Log the full response to inspect it

    if (speciesData && Array.isArray(speciesData.Species)) {
        let htmlContent = '<h2>Species Information</h2>';
        
        // Loop through each species in the array
        speciesData.Species.forEach(speciesDetails => {
            htmlContent += `<p><strong>Species:</strong> ${speciesDetails.ScientificName || 'Not available'} <br>
                            <strong>Common Name:</strong> ${speciesDetails.AcceptedCommonName || 'Not available'} <br>
                            <strong>Conservation Status:</strong> ${
                                speciesDetails.ConservationStatus && speciesDetails.ConservationStatus.ConservationSignificant !== undefined
                                ? (speciesDetails.ConservationStatus.ConservationSignificant ? "Conservation Significant" : "Not Conservation Significant")
                                : "Not available"} <br>
                            <strong>Environment:</strong> ${speciesDetails.SpeciesEnvironment || 'Not available'} <br>
                            <strong>Profile:</strong> <a href="#" class="view-profile" data-url="${speciesDetails.SpeciesProfileUrl}">View Profile</a>
                            </p><hr>`;
        });

        $('#species-info-container').html(htmlContent);

        // Step 2: Attach event listener for the "View Profile" link
        $('.view-profile').on('click', function(event) {
            event.preventDefault();
            const profileUrl = $(this).data('url');
            fetchSpeciesProfile(profileUrl);  // Fetch the profile data
        });
    } else {
        $('#species-info-container').html('<p>No species data available.</p>');
    }
}

// Fetch additional species profile information and display it in a modal
function fetchSpeciesProfile(profileUrl) {
    profileUrl = ensureHttpsUrl(profileUrl);
    console.log('Species Profile URL:', profileUrl);

    $.ajax({
        url: profileUrl,
        dataType: 'json',
        success: function(profileData) {
            console.log('Profile Data:', profileData);

            if (profileData && profileData.Species && Object.keys(profileData.Species).length > 0) {
                const speciesDetails = profileData.Species;

                const acceptedCommonName = speciesDetails.AcceptedCommonName || 'Not available';
                const classCommonName = speciesDetails.ClassCommonName || 'Not available';
                const familyCommonName = speciesDetails.FamilyCommonName || 'Not available';
                const familyName = speciesDetails.FamilyName || 'Not available';
                const scientificName = speciesDetails.ScientificName || 'Not available';
                const speciesEnvironment = speciesDetails.SpeciesEnvironment || 'Not available';

                let modalContent = `<h3>${acceptedCommonName}</h3>
                                    <p><strong>Class Common Name:</strong> ${classCommonName}</p>
                                    <p><strong>Family Common Name:</strong> ${familyCommonName}</p>
                                    <p><strong>Family Name:</strong> ${familyName}</p>
                                    <p><strong>Scientific Name:</strong> ${scientificName}</p>
                                    <p><strong>Environment:</strong> ${speciesEnvironment}</p>`;

                $('#modal-body').html(modalContent);

                const modal = document.getElementById("speciesProfileModal");
                modal.style.display = "block";
            } else {
                console.error("No species data found for this profile.");
                $('#modal-body').html('<p>No species data found.</p>');
                const modal = document.getElementById("speciesProfileModal");
                modal.style.display = "block";
            }
        },
        error: function(error) {
            console.log("Error fetching species profile:", error);
            $('#modal-body').html('<p>There was an error fetching species profile data.</p>');
            const modal = document.getElementById("speciesProfileModal");
            modal.style.display = "block";
        }
    });
}

// Close the modal when the user clicks on the close button
$(document).ready(function() {
    const modal = document.getElementById("speciesProfileModal");
    const span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    };

    // Close the modal if the user clicks anywhere outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});

// Initialize the chain of API requests
fetchClassNames();