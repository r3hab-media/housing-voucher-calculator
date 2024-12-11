// Constants for calculations
const MAX_AFFORDABLE_PERCENT = 0.401; // 40.1%

// Utility Allowances Data Structure
const utilityAllowances = {
	SRP: {
		MF: {
			heating: { naturalGas: [26, 28, 30, 33, 35], electric: [6, 7, 9, 10, 11] },
			cooking: { naturalGas: [7, 7, 12, 14, 19], electric: [4, 5, 8, 10, 12] },
			waterHeating: { naturalGas: [14, 16, 23, 30, 37], electric: [10, 12, 15, 18, 21] },
		},
		SFD: {
			heating: { naturalGas: [32, 39, 41, 43, 48], electric: [11, 13, 15, 17, 18] },
			cooking: { naturalGas: [6, 6, 11, 13, 17], electric: [4, 5, 8, 10, 12] },
			waterHeating: { naturalGas: [15, 19, 26, 35, 43], electric: [12, 15, 19, 23, 27] },
		},
	},
	APS: {
		MF: {
			heating: { naturalGas: [26, 28, 30, 33, 35], electric: [10, 12, 14, 16, 18] },
			cooking: { naturalGas: [7, 7, 12, 14, 19], electric: [6, 7, 10, 14, 17] },
			waterHeating: { naturalGas: [14, 16, 23, 30, 37], electric: [14, 16, 20, 25, 29] },
		},
		SFD: {
			heating: { naturalGas: [32, 39, 41, 43, 48], electric: [18, 22, 24, 27, 29] },
			cooking: { naturalGas: [6, 6, 11, 13, 17], electric: [6, 7, 10, 14, 17] },
			waterHeating: { naturalGas: [15, 19, 26, 35, 43], electric: [17, 20, 25, 31, 36] },
		},
	},
	SW: {
		MF: {
			heating: { naturalGas: [26, 28, 30, 33, 35] },
			cooking: { naturalGas: [7, 7, 12, 14, 19] },
			waterHeating: { naturalGas: [14, 16, 23, 30, 37] },
		},
		SFD: {
			heating: { naturalGas: [32, 39, 41, 43, 48] },
			cooking: { naturalGas: [6, 6, 11, 13, 17] },
			waterHeating: { naturalGas: [15, 19, 26, 35, 43] },
		},
	},
};

// Base fees for SRP and APS based on voucher size
const baseFees = {
	SRP: {
		SFD: { flatFee: 21, voucherSizeFees: [25, 29, 40, 52, 63] },
		MF: { flatFee: 21, voucherSizeFees: [17, 20, 28, 35, 43] },
	},
	APS: {
		SFD: { flatFee: 0, voucherSizeFees: [46, 52, 69, 84, 100] },
		MF: { flatFee: 0, voucherSizeFees: [35, 39, 50, 61, 72] },
	},
};

// Consolidated values for additional utilities
const baseAdditionalUtilities = {
	water: [29, 29, 32, 37, 42],
	sewer: [18, 18, 23, 28, 32],
	trash: [28, 28, 28, 28, 28],
	refrigerator: [12, 12, 12, 12, 12],
	rangeMicrowave: [11, 11, 11, 11, 11],
};

// Specific overrides for air conditioning
const airConditioningOverrides = {
	SRP: {
		MF: [18, 21, 29, 37, 45],
		SFD: [14, 16, 36, 57, 77],
	},
	APS: {
		MF: [21, 25, 34, 44, 54],
		SFD: [16, 19, 43, 67, 98],
	},
};

// Generate additional utilities dynamically
const additionalUtilities = ["SRP", "APS"].reduce((result, provider) => {
	result[provider] = ["MF", "SFD"].reduce((unitTypes, unitType) => {
		unitTypes[unitType] = {
			...baseAdditionalUtilities,
			airConditioning: airConditioningOverrides[provider][unitType],
		};
		return unitTypes;
	}, {});
	return result;
}, {});

console.log(additionalUtilities);

// Payment standards based on voucher size and zip code
const paymentStandards = {
	0: {
		85250: 1836,
		85251: 1836,
		85253: 2213,
		85254: 2029,
		85255: 2346,
		85257: 1744,
		85258: 2101,
		85259: 1723,
		85260: 2142,
		85262: 2346,
		85263: 2101,
		85264: 1774,
		85266: 2346,
		85268: 1815,
	},
	1: {
		85250: 2009,
		85251: 2009,
		85253: 2427,
		85254: 2223,
		85255: 2570,
		85257: 1917,
		85258: 2305,
		85259: 1897,
		85260: 2356,
		85262: 2570,
		85263: 2305,
		85264: 1948,
		85266: 2570,
		85268: 1989,
	},
	2: {
		85250: 2335,
		85251: 2335,
		85253: 2825,
		85254: 2580,
		85255: 2988,
		85257: 2223,
		85258: 2672,
		85259: 2203,
		85260: 2733,
		85262: 2988,
		85263: 2713,
		85264: 2295,
		85266: 2988,
		85268: 2315,
	},
	3: {
		85250: 3141,
		85251: 3141,
		85253: 3804,
		85254: 3468,
		85255: 4018,
		85257: 2988,
		85258: 3600,
		85259: 2968,
		85260: 3682,
		85262: 4018,
		85263: 3651,
		85264: 3090,
		85266: 4018,
		85268: 3111,
	},
	4: {
		85250: 3519,
		85251: 3519,
		85253: 4253,
		85254: 3886,
		85255: 4498,
		85257: 3345,
		85258: 4018,
		85259: 3315,
		85260: 4110,
		85262: 4498,
		85263: 4059,
		85264: 3437,
		85266: 4498,
		85268: 3488,
	},
};

// Map for Voucher Size display names
const voucherSizeNames = {
	0: "Studio",
	1: "1",
	2: "2",
	3: "3",
	4: "4",
};

// Parse currency input to numeric values
function parseCurrency(value) {
	return parseInt(value.replace(/[^0-9.-]+/g, "")) || 0;
}

// Format currency input
function formatCurrencyInput(input) {
	let value = input.value.replace(/[^0-9]/g, "");
	const numericValue = parseInt(value);

	if (!isNaN(numericValue)) {
		input.value = numericValue.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		});
	} else {
		input.value = "";
	}
}

// Add DOMContentLoaded event listener for initializing functions
document.addEventListener("DOMContentLoaded", () => {
	displayPaymentStandard(); // Existing function
	calculateAffordability(); // Existing function
	enforceSingleSelection(); // Newly added function
});

// Display payment standard
function displayPaymentStandard() {
	const voucherSizeValue = document.getElementById("voucherSizeSelect").value;
	const zipCode = document.getElementById("zipCodeSelect").value;

	if (voucherSizeValue && zipCode) {
		const paymentStandard = paymentStandards[voucherSizeValue]?.[zipCode] || "Not available";
		document.getElementById("paymentStandard").innerHTML = `
      <h5>Voucher Size: ${voucherSizeNames[voucherSizeValue]}</h5>
      <h5>Zip Code: ${zipCode}</h5>
      <h5>Payment Standard: $${paymentStandard}</h5>`;
	} else {
		document.getElementById("paymentStandard").innerHTML = `<h6>Please select both Voucher Size and Zip Code.</h6>`;
	}
}

// Get active provider
function getActiveProvider() {
	const activeTab = document.querySelector(".nav-tabs .nav-link.active");
	if (activeTab.id.includes("srp")) return "SRP";
	if (activeTab.id.includes("aps")) return "APS";
	return "SW";
}

// Map input IDs to utility keys
function getUtilityKeyFromId(id) {
	const idMap = {
		ACon: "airConditioning",
		Fridge: "refrigerator",
		Micro: "rangeMicrowave",
		Water: "water",
		Sewer: "sewer",
		Trash: "trash",
	};
	return idMap[id] || id.toLowerCase();
}

// Calculate Total Tenant Payment (TTP)
function calculateTTP() {
	const income = parseCurrency(document.getElementById("monthlyAdjustedIncome").value || "0");
	const TTP = Math.round(income * 0.3);
	document.getElementById("totalTenantPayment").value = `$${TTP.toLocaleString("en-US", {
		minimumFractionDigits: 0,
	})}`;
	return TTP;
}

// Calculate affordability
function calculateAffordability() {
	const provider = getActiveProvider(); // SRP, APS, or SW
	const unitType = document.querySelector(".tab-pane.active .nav-pills .nav-link.active").id.includes("sfd") ? "SFD" : "MF";

	const voucherSizeValue = document.getElementById("voucherSizeSelect").value;
	const zipCode = document.getElementById("zipCodeSelect").value;
	const contractRentValue = document.getElementById("contractRent").value;
	const monthlyIncomeValue = document.getElementById("monthlyAdjustedIncome").value;

	// Ensure voucher size and zip code are selected before proceeding
	if (!voucherSizeValue || !zipCode) {
		displayPaymentStandard();
		return;
	}

	const voucherSize = parseInt(voucherSizeValue);
	const paymentStandard = paymentStandards[voucherSize]?.[zipCode] || 0;

	// Ensure Monthly Adjusted Income and Contract Rent are provided
	if (!monthlyIncomeValue || !contractRentValue) return;

	const contractRent = parseCurrency(contractRentValue);
	const monthlyIncome = parseCurrency(monthlyIncomeValue);

	let totalUtilityCosts = 0;

	// Calculate costs for main utilities (heating, cooking, water heating)
	const utilityCheckboxes = document.querySelectorAll('.tab-pane.active input[type="checkbox"]:checked');
	utilityCheckboxes.forEach((checkbox) => {
		const utilityType = checkbox.name.split("_")[2]; // Extract utility type from name attribute
		const fuelType = checkbox.value; // Extract fuel type

		if (utilityAllowances[provider][unitType][utilityType]?.[fuelType]) {
			totalUtilityCosts += utilityAllowances[provider][unitType][utilityType][fuelType][voucherSize] || 0;
		}
	});

	// Calculate costs for additional utilities (water, sewer, trash, etc.)
	const additionalUtilityCheckboxes = document.querySelectorAll('#additionalUtilities input[type="checkbox"]:checked');
	additionalUtilityCheckboxes.forEach((checkbox) => {
		const utilityKey = getUtilityKeyFromId(checkbox.id.split("_")[1]); // Extract utility key (e.g., water, sewer, etc.)
		const additionalCosts = additionalUtilities[provider]?.[unitType]?.[utilityKey] || baseAdditionalUtilities[utilityKey];

		if (additionalCosts) {
			totalUtilityCosts += additionalCosts[voucherSize] || 0;
		}
	});

	// Calculate gross rent and tenant payment
	const grossRent = contractRent + totalUtilityCosts;
	let tenantPayment = calculateTTP();

	// Adjust tenant payment if gross rent exceeds payment standard
	if (grossRent > paymentStandard) {
		tenantPayment += grossRent - paymentStandard;
	}

	tenantPayment = Math.min(tenantPayment, grossRent);

	// Determine if the unit is affordable based on the tenant payment
	const maxAffordable = monthlyIncome * MAX_AFFORDABLE_PERCENT;
	const isAffordable = tenantPayment <= maxAffordable;

	// Display calculated values
	displayPaymentStandard();
	const resultsHTML = `
    <h5>Total Utilities: $${totalUtilityCosts.toLocaleString()}</h5>
    <h5>Gross Rent (including utilities): $${grossRent.toLocaleString()}</h5>
    <h5>Tenant Payment: $${tenantPayment.toLocaleString()}</h5>
    <h5><span class="${isAffordable ? "text-success" : "text-danger"}">
        ${isAffordable ? "Unit is affordable." : "Unit is unaffordable."}
    </span></h5>`;
	document.getElementById("paymentStandard").innerHTML += resultsHTML;
}

// Function to enforce single selection for heating, cooking, and water heating
function enforceSingleSelection() {
	const utilityGroups = ["heating", "cooking", "waterHeating"];

	utilityGroups.forEach((group) => {
		const checkboxes = document.querySelectorAll(`input[name*="_${group}"]`);
		checkboxes.forEach((checkbox) => {
			checkbox.addEventListener("change", () => {
				if (checkbox.checked) {
					checkboxes.forEach((otherCheckbox) => {
						if (otherCheckbox !== checkbox) {
							otherCheckbox.disabled = true;
						}
					});
				} else {
					checkboxes.forEach((otherCheckbox) => {
						otherCheckbox.disabled = false;
					});
				}
			});
		});
	});
}

function updateOtherElectric() {
	const provider = getActiveProvider(); // Get active provider (SRP, APS, SW)
	const unitType = document.querySelector(".tab-pane.active .nav-pills .nav-link.active").id.includes("sfd") ? "SFD" : "MF";
	const voucherSizeValue = document.getElementById("voucherSizeSelect").value;

	// Ensure a voucher size is selected
	if (!voucherSizeValue) {
		document.getElementById("otherElectric").textContent = ""; // Clear if not selected
		return;
	}

	const voucherSize = parseInt(voucherSizeValue);

	// Check if any relevant checkboxes are selected
	const relevantSelectors = [
		'#pills-srp-tabContent input[type="checkbox"]:checked',
		'#pills-aps-tabContent input[type="checkbox"]:checked',
		"#Util_ACon:checked",
		"#Util_Fridge:checked",
		"#Util_Micro:checked",
	];

	const isAnyRelevantSelected = relevantSelectors.some((selector) => document.querySelector(selector));

	// If no relevant checkbox is selected, clear the `otherElectric` span
	if (!isAnyRelevantSelected) {
		document.getElementById("otherElectric").textContent = "";
		return;
	}

	// Calculate the other electric fee if relevant inputs are selected
	const otherElectricFee = baseFees[provider]?.[unitType]?.voucherSizeFees[voucherSize] || 0;

	// Update the `otherElectric` span in the DOM
	document.getElementById("otherElectric").textContent = `$${otherElectricFee.toLocaleString()}`;
}

// Attach event listeners and initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
	displayPaymentStandard(); // Initialize payment standard display
	calculateAffordability(); // Initialize affordability calculations
	enforceSingleSelection(); // Enforce single selection for utilities
	updateOtherElectric(); // Initialize otherElectric span
});

// Attach event listeners to all relevant inputs
const relevantInputs = [
	...document.querySelectorAll('#pills-srp-tabContent input[type="checkbox"]'),
	...document.querySelectorAll('#pills-aps-tabContent input[type="checkbox"]'),
	document.getElementById("Util_ACon"),
	document.getElementById("Util_Fridge"),
	document.getElementById("Util_Micro"),
];

relevantInputs.forEach((input) => {
	input.addEventListener("change", updateOtherElectric);
});

// Attach event listeners to dynamically update `otherElectric`
document.getElementById("voucherSizeSelect").addEventListener("change", updateOtherElectric);

document.querySelectorAll('button[data-bs-toggle="tab"]').forEach((tab) => {
	tab.addEventListener("shown.bs.tab", () => {
		updateOtherElectric();
	});
});

// Reset form
function resetForm() {
	document.getElementById("voucherSizeSelect").value = "";
	document.getElementById("zipCodeSelect").value = "";
	document.getElementById("monthlyAdjustedIncome").value = "";
	document.getElementById("contractRent").value = "";
	document.getElementById("totalTenantPayment").value = "";
	document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((input) => (input.checked = false));
	document.getElementById("paymentStandard").innerHTML = `<h6>Please select both Voucher Size and Zip Code to see the Payment Standard.</h6>`;
}

// Event listeners
document.getElementById("voucherSizeSelect").addEventListener("change", () => {
	displayPaymentStandard();
	calculateAffordability();
	updateOtherElectric();
});

document.getElementById("zipCodeSelect").addEventListener("change", () => {
	displayPaymentStandard();
	calculateAffordability();
});

document.getElementById("monthlyAdjustedIncome").addEventListener("input", () => {
	calculateTTP();
	calculateAffordability();
});

document.getElementById("contractRent").addEventListener("input", () => {
	calculateAffordability();
});

document.addEventListener("change", (e) => {
	if (e.target.matches('input[type="checkbox"]')) {
		calculateAffordability();
	}
});

document.getElementById("startOver").addEventListener("click", resetForm);

document.addEventListener("DOMContentLoaded", () => {
	displayPaymentStandard();
	calculateAffordability();
});
