// Constants for calculations
const MAX_AFFORDABLE_PERCENT = 0.401; // 40.1%

document.addEventListener("input", function (e) {
	if (e.target.classList.contains("is-currency")) {
		formatCurrencyInput(e.target);
	}
});

// Utility Allowances Data Structure
const utilityAllowances = {
	SRP: {
		SFD: {
			heating: {
				naturalGas: [32, 39, 41, 43, 48], // For voucher sizes 0-4
				electric: [11, 13, 15, 17, 18],
			},
			cooking: {
				naturalGas: [6, 6, 11, 13, 17],
				electric: [4, 5, 8, 10, 12],
			},
			waterHeating: {
				naturalGas: [15, 19, 26, 35, 43],
				electric: [12, 15, 19, 23, 27],
			},
		},
		MF: {
			heating: {
				naturalGas: [26, 28, 30, 33, 35],
				electric: [6, 7, 9, 10, 11],
			},
			cooking: {
				naturalGas: [7, 7, 12, 14, 19],
				electric: [4, 5, 8, 10, 12],
			},
			waterHeating: {
				naturalGas: [14, 16, 23, 30, 37],
				electric: [10, 12, 15, 18, 21],
			},
		},
	},
	APS: {
		SFD: {
			heating: {
				naturalGas: [32, 39, 41, 43, 48],
				electric: [18, 22, 24, 27, 29],
			},
			cooking: {
				naturalGas: [6, 6, 11, 13, 17],
				electric: [6, 7, 10, 14, 17],
			},
			waterHeating: {
				naturalGas: [15, 19, 26, 35, 43],
				electric: [17, 20, 25, 31, 36],
			},
		},
		MF: {
			heating: {
				naturalGas: [26, 28, 30, 33, 35],
				electric: [10, 12, 14, 16, 18],
			},
			cooking: {
				naturalGas: [7, 7, 12, 14, 19],
				electric: [6, 7, 10, 14, 17],
			},
			waterHeating: {
				naturalGas: [14, 16, 23, 30, 37],
				electric: [14, 16, 20, 25, 29],
			},
		},
	},
};

const additionalUtilities = {
	SRP: {
		SFD: {
			water: [29, 29, 32, 37, 42], //DONE
			sewer: [18, 18, 23, 28, 32], //DONE
			trash: [28, 28, 28, 28, 28],
			acon: [14, 16, 36, 57, 77],
			fridge: [12, 12, 12, 12, 12],
			micro: [11, 11, 11, 11, 11],
		},
		MF: {
			water: [29, 29, 32, 37, 42],
			sewer: [18, 18, 23, 28, 32],
			trash: [28, 28, 28, 28, 28],
			acon: [18, 21, 29, 37, 45],
			fridge: [12, 12, 12, 12, 12],
			micro: [11, 11, 11, 11, 11],
		},
	},
	APS: {
		SFD: {
			water: [29, 29, 32, 37, 42],
			sewer: [18, 18, 23, 28, 32],
			trash: [28, 28, 28, 28, 28],
			acon: [16, 19, 43, 67, 98],
			fridge: [12, 12, 12, 12, 12],
			micro: [11, 11, 11, 11, 11],
		},
		MF: {
			water: [29, 29, 32, 37, 42],
			sewer: [18, 18, 23, 28, 32],
			trash: [28, 28, 28, 28, 28],
			acon: [21, 25, 34, 44, 54],
			fridge: [12, 12, 12, 12, 12],
			micro: [11, 11, 11, 11, 11],
		},
	},
};

// Payment standards based on voucher size and zip code
const paymentStandards = {
	0: { 85250: 1836, 85251: 1836, 85253: 2213, 85254: 2029 },
	1: { 85250: 2009, 85251: 1726, 85253: 2427, 85254: 2223 },
	2: { 85250: 2335, 85251: 2335, 85253: 2825, 85254: 2580 },
	3: { 85250: 3141, 85251: 3141, 85253: 3804, 85254: 3468 },
	4: { 85250: 3519, 85251: 3519, 85253: 4253, 85254: 3886 },
};

// Format currency input
function formatCurrencyInput(input) {
	let value = input.value.replace(/[^0-9]/g, "");
	if (value.length === 0) {
		input.value = "";
		return;
	}
	let formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	input.value = `$${formattedValue}`;
}

// Parse currency input to numeric values
function parseCurrency(value) {
	return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
}

// Get utility cost based on selections
function getUtilityCost(provider, unitType, utilityType, fuelType, voucherSize) {
	const allowances = utilityAllowances[provider][unitType][utilityType][fuelType];
	return allowances[voucherSize] || 0;
}

// Get selected fuel types for each utility
function getSelectedFuelTypes(provider, unitType) {
	const utilities = ["heating", "cooking", "waterHeating"];
	const selectedFuelTypes = {};

	utilities.forEach((utility) => {
		const radios = document.getElementsByName(`${provider}_${unitType}_${utility}`);
		let isSelected = false;

		for (const radio of radios) {
			if (radio.checked) {
				selectedFuelTypes[utility] = radio.value;
				isSelected = true; // Track if a selection is made
				break;
			}
		}

		// Set to $0 if no selection is made
		if (!isSelected) {
			selectedFuelTypes[utility] = "none";
		}
	});

	return selectedFuelTypes;
}

// Calculate Total Tenant Payment (TTP)
function calculateTTP() {
	const monthlyIncome = parseCurrency(document.getElementById("monthlyAdjustedIncome").value);
	const TTP = Math.round(monthlyIncome * 0.3); // Round to nearest dollar
	document.getElementById("totalTenantPayment").value = `$${TTP.toLocaleString()}`;
	return TTP;
}

// Calculate affordability and display the result
function calculateAffordability() {
	const voucherSize = parseInt(document.getElementById("voucherSizeSelect").value);
	const zipCode = document.getElementById("zipCodeSelect").value;
	const contractRent = parseCurrency(document.getElementById("contractRent").value);
	const paymentStandard = paymentStandards[voucherSize]?.[zipCode] || 0;

	const provider = document.querySelector(".tab-pane.active").id === "srp" ? "SRP" : "APS";
	const unitType = document.querySelector(".tab-pane.active .tab-pane.active").id.includes("sfd") ? "SFD" : "MF";

	const selectedFuelTypes = getSelectedFuelTypes(provider, unitType);

	let totalUtilityCosts = 0;

	// Calculate utility costs based on fuel type selections
	["heating", "cooking", "waterHeating"].forEach((utility) => {
		const fuelType = selectedFuelTypes[utility];
		totalUtilityCosts += getUtilityCost(provider, unitType, utility, fuelType, voucherSize);
	});

	// Add additional utility costs for selected checkboxes
	document.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
		const utilityId = checkbox.id.split("_").slice(2).join("_").toLowerCase(); // Extract utility name
		const utilityCost = additionalUtilities[provider][unitType][utilityId]?.[voucherSize] || 0;
		totalUtilityCosts += utilityCost;
	});

	const grossRent = contractRent + totalUtilityCosts;
	let tenantPayment = calculateTTP();

	if (grossRent > paymentStandard) {
		tenantPayment += grossRent - paymentStandard;
	}

	const maxAffordable = parseCurrency(document.getElementById("monthlyAdjustedIncome").value) * MAX_AFFORDABLE_PERCENT;
	const isAffordable = tenantPayment <= maxAffordable;

	const affordabilityMessage = isAffordable ? "Unit is affordable." : "Unit is unaffordable.";
	const messageClass = isAffordable ? "text-success" : "text-danger";

	document.getElementById("paymentStandard").innerHTML = `
    <h5>Payment Standard: $${paymentStandard.toLocaleString()}</h5>
    <h5>Gross Rent (including utilities): $${grossRent.toLocaleString()}</h5>
    <h5>Tenant Payment: $${tenantPayment.toLocaleString()}</h5>
    <h5><span class="${messageClass}">${affordabilityMessage}</span></h5>`;
}

// Attach event listeners to input fields and buttons
document.getElementById("monthlyAdjustedIncome").addEventListener("input", calculateTTP);
// document.getElementById("calculateRent").addEventListener("click", calculateAffordability);
document.getElementById("voucherSizeSelect").addEventListener("change", calculateAffordability);
document.getElementById("zipCodeSelect").addEventListener("change", calculateAffordability);
document.getElementById("contractRent").addEventListener("input", calculateAffordability);

// Attach utility radio and checkbox event listeners
function attachUtilityEventListeners() {
	document.querySelectorAll('input[type="radio"]').forEach((radio) => {
		radio.addEventListener("change", calculateAffordability);
	});

	document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
		checkbox.addEventListener("change", calculateAffordability);
	});
}

// Initialize event listeners after DOM content loads
document.addEventListener("DOMContentLoaded", () => {
	attachUtilityEventListeners();
});
