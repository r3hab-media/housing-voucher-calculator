// Constants for calculations
const MAX_AFFORDABLE_PERCENT = 0.401; // 40.1%

// Attach event listeners to format currency inputs on blur
document.addEventListener("focusout", function (e) {
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

// Additional utilities (i.e.; Trash, Water, Sewer, etc.)
const additionalUtilities = {
	SRP: {
		SFD: {
			water: [29, 29, 32, 37, 42],
			sewer: [18, 18, 23, 28, 32],
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
	0: {
		85250: 1836,
		85251: 1836,
		85253: 2213,
		85254: 2029,
		85255: 2029,
		85257: 1836,
		85258: 1836,
		85259: 1836,
		85260: 1836,
		85262: 1836,
		85263: 1836,
		85264: 1836,
		85266: 1836,
		85268: 1836,
	},
	1: {
		85250: 2009,
		85251: 1726,
		85253: 2427,
		85254: 2223,
		85255: 2223,
		85257: 1726,
		85258: 1726,
		85259: 1726,
		85260: 1726,
		85262: 1726,
		85263: 1726,
		85264: 1726,
		85266: 1726,
		85268: 1726,
	},
	2: {
		85250: 2335,
		85251: 2335,
		85253: 2825,
		85254: 2580,
		85255: 2580,
		85257: 2335,
		85258: 2335,
		85259: 2335,
		85260: 2335,
		85262: 2335,
		85263: 2335,
		85264: 2335,
		85266: 2335,
		85268: 2335,
	},
	3: {
		85250: 3141,
		85251: 3141,
		85253: 3804,
		85254: 3468,
		85255: 3468,
		85257: 3141,
		85258: 3141,
		85259: 3141,
		85260: 3141,
		85262: 3141,
		85263: 3141,
		85264: 3141,
		85266: 3141,
		85268: 3141,
	},
	4: {
		85250: 3519,
		85251: 3519,
		85253: 4253,
		85254: 3886,
		85255: 3886,
		85257: 3519,
		85258: 3519,
		85259: 3519,
		85260: 3519,
		85262: 3519,
		85263: 3519,
		85264: 3519,
		85266: 3519,
		85268: 3519,
	},
};

// Display payment standard after Voucher Size and Zip Code are selected
function displayPaymentStandard() {
	const voucherSizeValue = document.getElementById("voucherSizeSelect").value;
	const zipCode = document.getElementById("zipCodeSelect").value;

	if (voucherSizeValue && zipCode) {
		const voucherSize = parseInt(voucherSizeValue);
		const paymentStandard = paymentStandards[voucherSize]?.[zipCode];

		// Display the payment standard
		if (paymentStandard === undefined) {
			document.getElementById("paymentStandard").innerHTML = `<h6>For Payment Standard, please select the Voucher Size and Zip Code.</h6>`;
		} else {
			document.getElementById("paymentStandard").innerHTML = `<h5>Payment Standard: $${paymentStandard.toLocaleString("en-US", {
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			})}</h5>`;
		}
	} else {
		// Hide the payment standard or display a prompt
		document.getElementById("paymentStandard").innerHTML = `<h6>For Payment Standard, please select the Voucher Size and Zip Code.</h6>`;
	}
}

// Format currency input (unchanged)
function formatCurrencyInput(input) {
	let value = input.value;

	// Remove any character that is not a digit
	value = value.replace(/[^0-9]/g, "");

	if (value.length === 0) {
		input.value = "";
		return;
	}

	const numericValue = parseInt(value);

	if (isNaN(numericValue)) {
		input.value = "";
	} else {
		// Format the number as currency without decimals
		const formattedValue = numericValue.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
		input.value = formattedValue;
	}
}

// Parse currency input to numeric values (unchanged)
function parseCurrency(value) {
	return parseInt(value.replace(/[^0-9.-]+/g, "")) || 0;
}

// Get utility cost based on selections (unchanged)
function getUtilityCost(provider, unitType, utilityType, fuelType, voucherSize) {
	const allowances = utilityAllowances[provider][unitType][utilityType][fuelType];
	if (allowances && allowances[voucherSize] !== undefined) {
		return allowances[voucherSize];
	} else {
		return 0;
	}
}

// Get selected fuel types for each utility (unchanged)
function getSelectedFuelTypes(provider, unitType) {
	const utilities = ["heating", "cooking", "waterHeating"];
	const selectedFuelTypes = {};

	utilities.forEach((utility) => {
		const radios = document.getElementsByName(`${provider}_${unitType}_${utility}`);
		let isSelected = false;

		for (const radio of radios) {
			if (radio.checked) {
				selectedFuelTypes[utility] = radio.value;
				isSelected = true;
				break;
			}
		}

		// Set to "none" if no selection is made
		if (!isSelected) {
			selectedFuelTypes[utility] = "none";
		}
	});

	return selectedFuelTypes;
}

// Calculate Total Tenant Payment (TTP) (unchanged)
function calculateTTP() {
	const monthlyIncome = parseCurrency(document.getElementById("monthlyAdjustedIncome").value);
	const TTP = Math.round(monthlyIncome * 0.3); // Round to nearest dollar
	document.getElementById("totalTenantPayment").value = `$${TTP.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
	return TTP;
}

// Calculate affordability and display the result
function calculateAffordability() {
	const voucherSizeValue = document.getElementById("voucherSizeSelect").value;
	const zipCode = document.getElementById("zipCodeSelect").value;
	const contractRentValue = document.getElementById("contractRent").value;
	const monthlyIncomeValue = document.getElementById("monthlyAdjustedIncome").value;

	// Check if Voucher Size and Zip Code are selected
	if (!voucherSizeValue || !zipCode) {
		// Cannot proceed without Voucher Size and Zip Code
		displayPaymentStandard();
		return;
	}

	const voucherSize = parseInt(voucherSizeValue);
	const paymentStandard = paymentStandards[voucherSize]?.[zipCode];

	// Display the Payment Standard
	displayPaymentStandard();

	// If Contract Rent is not entered, hide Gross Rent, Tenant Payment, and Affordability
	if (!contractRentValue || parseCurrency(contractRentValue) === 0) {
		return;
	}

	// Ensure Monthly Adjusted Income is entered to calculate TTP
	if (!monthlyIncomeValue || parseCurrency(monthlyIncomeValue) === 0) {
		return;
	}

	const contractRent = parseCurrency(contractRentValue);
	const provider = document.querySelector(".nav-tabs .nav-link.active").id.includes("srp") ? "SRP" : "APS";
	const unitType = document.querySelector(".tab-pane.active .nav-pills .nav-link.active").id.includes("sfd") ? "SFD" : "MF";

	const selectedFuelTypes = getSelectedFuelTypes(provider, unitType);

	let totalUtilityCosts = 0;

	// Calculate utility costs based on fuel type selections
	["heating", "cooking", "waterHeating"].forEach((utility) => {
		const fuelType = selectedFuelTypes[utility];
		if (fuelType !== "none") {
			totalUtilityCosts += getUtilityCost(provider, unitType, utility, fuelType, voucherSize);
		}
	});

	// Add additional utility costs for selected checkboxes
	document.querySelectorAll('.tab-pane.active input[type="checkbox"]:checked').forEach((checkbox) => {
		const utilityIdParts = checkbox.id.split("_");
		const utilityId = utilityIdParts.slice(2).join("_").toLowerCase(); // Extract utility name
		const utilityCost = additionalUtilities[provider][unitType][utilityId]?.[voucherSize] || 0;
		totalUtilityCosts += utilityCost;
	});

	const grossRent = contractRent + totalUtilityCosts;
	let tenantPayment = calculateTTP();

	if (grossRent > paymentStandard) {
		tenantPayment += grossRent - paymentStandard;
	}

	tenantPayment = Math.min(tenantPayment, grossRent);

	const maxAffordable = parseCurrency(document.getElementById("monthlyAdjustedIncome").value) * MAX_AFFORDABLE_PERCENT;
	const isAffordable = tenantPayment <= maxAffordable;

	const affordabilityMessage = isAffordable ? "Unit is affordable." : "Unit is unaffordable.";
	const messageClass = isAffordable ? "text-success" : "text-danger";

	// Append the Gross Rent, Tenant Payment, and Affordability to the paymentStandard div
	document.getElementById("paymentStandard").innerHTML += `<h5>Gross Rent (including utilities): $${grossRent.toLocaleString("en-US", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	})}</h5>
      <h5>Tenant Payment: $${tenantPayment.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h5>
      <h5><span class="${messageClass}">${affordabilityMessage}</span></h5>`;
}

// Attach event listeners to input fields and buttons
document.getElementById("voucherSizeSelect").addEventListener("change", () => {
	displayPaymentStandard();
	calculateAffordability();
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

// Attach utility radio and checkbox event listeners using event delegation
document.addEventListener("change", function (e) {
	if (e.target.matches('input[type="radio"], input[type="checkbox"]')) {
		calculateAffordability();
	}
});

// Initialize event listeners after DOM content loads
document.addEventListener("DOMContentLoaded", () => {
	displayPaymentStandard();
	calculateAffordability();
});
