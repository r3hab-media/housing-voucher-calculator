// map for voucher size display names
const voucherSizeNames = {
	0: "Studio",
	1: "1",
	2: "2",
	3: "3",
	4: "4",
};

// payment standards
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

// utility allowances data structure
const utilityAllowances = {
	SRP: {
		MF: {
			heating: [6, 7, 9, 10, 11],
			cooking: [4, 5, 8, 10, 12],
			waterHeater: [10, 12, 15, 18, 21],
		},
		SFD: {
			heating: [11, 13, 15, 17, 18],
			cooking: [4, 5, 8, 10, 12],
			waterHeater: [12, 15, 19, 23, 27],
		},
	},
	APS: {
		MF: {
			heating: [10, 12, 14, 16, 18],
			cooking: [6, 7, 10, 14, 17],
			waterHeater: [14, 16, 20, 25, 29],
		},
		SFD: {
			heating: [18, 22, 24, 27, 29],
			cooking: [6, 7, 10, 14, 17],
			waterHeater: [17, 20, 25, 31, 36],
		},
	},
	SWG: {
		MF: {
			heating: [26, 28, 30, 33, 35],
			cooking: [7, 7, 12, 14, 19],
			waterHeater: [14, 16, 23, 30, 37],
		},
		SFD: {
			heating: [32, 39, 41, 43, 48],
			cooking: [6, 6, 11, 13, 17],
			waterHeater: [15, 19, 26, 35, 43],
		},
	},
};

// base fees for SRP and APS based on voucher size
const baseFees = {
	SRP: {
		MF: { flatFee: 21, otherElectric: [17, 20, 28, 35, 43] },
		SFD: { flatFee: 21, otherElectric: [25, 29, 40, 52, 63] },
	},
	APS: {
		MF: { flatFee: 0, otherElectric: [35, 39, 50, 61, 72] },
		SFD: { flatFee: 0, otherElectric: [46, 52, 69, 84, 100] },
	},
	SWG: {
		MF: { flatFee: 11 }, // Flat fee values for SWG MF
		SFD: { flatFee: 12 }, // Flat fee values for SWG SFD
	},
};

// additional utilities
const additionalUtilities = {
	water: [29, 29, 32, 37, 42],
	sewer: [18, 18, 23, 28, 32],
	trash: [28, 28, 28, 28, 28],
	refrigerator: [12, 12, 12, 12, 12],
	rangeMicrowave: [11, 11, 11, 11, 11],
};

// air conditioning costs
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

// Add a scroll listener to toggle sticky section visibility
window.addEventListener("scroll", () => {
	const fieldset = document.querySelector("fieldset");
	const stickyInfo = document.getElementById("stickyInfo");

	if (fieldset && stickyInfo) {
		const fieldsetBottom = fieldset.getBoundingClientRect().bottom;

		if (fieldsetBottom < 0) {
			stickyInfo.style.display = "block";
		} else {
			stickyInfo.style.display = "none";
		}
	}
});

document.addEventListener("DOMContentLoaded", function () {
	// Define all variables once
	const voucherSelect = document.getElementById("voucherSelect");
	const zipCodeSelect = document.getElementById("zipCodeSelect");
	const monthlyAdjustedIncomeInput = document.getElementById("monthlyAdjustedIncome");
	const contractRentInput = document.getElementById("contractRent");

	const paymentStandardDisplay = document.getElementById("paymentStandard");
	const voucherSizeSelection = document.getElementById("voucherSizeSelection");
	const zipCodeSelection = document.getElementById("zipCodeSelection");
	const monthlyAdjustedIncomeDisplay = document.getElementById("monthlyAdjustedIncomeDisplay");
	const totalTenantPayment = document.getElementById("totalTenantPayment");
	const isAffordableElement = document.getElementById("isAffordable");
	const grossRent = document.getElementById("grossRent");
	const totalUtilities = document.getElementById("totalUtilities");
	const contractRentDisplay = document.getElementById("contractRentDisplay");

	let currentTotalUtilities = 0;
	let baseGrossRent = 0;

	const disclaimerCheckbox = document.getElementById("formDisclaimer");
	const formElementsContainers = document.querySelectorAll(".form-inputs");

	function toggleFormElements() {
		const isEnabled = disclaimerCheckbox.checked;

		// Iterate through all .form-inputs containers
		formElementsContainers.forEach((container) => {
			const formElements = container.querySelectorAll("input, select");

			console.log("Form Elements Found:", formElements); // Debugging log

			formElements.forEach((element) => {
				// Do not disable the disclaimer checkbox itself
				if (element !== disclaimerCheckbox) {
					element.disabled = !isEnabled;
					console.log(`Element: ${element.tagName} | ID: ${element.id} | Disabled: ${element.disabled}`); // Debugging log
				}
			});
		});
	}

	// Initial state - disable all form elements
	toggleFormElements();

	// Add event listener to the disclaimer checkbox
	disclaimerCheckbox.addEventListener("change", toggleFormElements);

	// Update Payment Standard and Voucher Selection
	function updatePaymentStandard() {
		const selectedVoucher = voucherSelect.value;
		const selectedZipCode = zipCodeSelect.value;

		voucherSizeSelection.textContent = voucherSizeNames[selectedVoucher] || "N/A";
		zipCodeSelection.textContent = selectedZipCode || "N/A";

		if (selectedVoucher && selectedZipCode) {
			const paymentStandardValue = paymentStandards[selectedVoucher]?.[selectedZipCode];
			paymentStandardDisplay.textContent = paymentStandardValue ? `$${paymentStandardValue}` : "N/A";
		} else {
			paymentStandardDisplay.textContent = "N/A";
		}

		// Recalculate everything after payment standard change
		updateUtilityValue();
		updateMonthlyAdjustedIncome();
		updateStickySection(); // Ensure the sticky section updates
	}

	// update utility value and gross rent
	// Function to calculate the gross rent (including utilities)
	function updateGrossRent(totalUtilityValue) {
		const contractRentValue = parseFloat(contractRentInput.value) || 0;
		const grossRentValue = contractRentValue + totalUtilityValue;
		grossRent.textContent = `$${grossRentValue}`;
		updateMonthlyAdjustedIncome(); // Recalculate affordability based on new gross rent
		updateStickySection(); // Ensure the sticky section updates
	}

	// Function to calculate and update utility values
	// Attach event listeners to all additional utility checkboxes
	const additionalUtilityCheckboxes = document.querySelectorAll("#additionalUtililties input[type='checkbox']");
	additionalUtilityCheckboxes.forEach((checkbox) => {
		checkbox.addEventListener("change", updateUtilityValue);
	});

	// Include the calculation logic in updateUtilityValue
	function updateUtilityValue() {
		const voucherSize = voucherSelect.value;
		if (!voucherSize) return; // Exit if voucher size is not selected

		// Determine the active unit type (MF or SFD)
		const unitType = document.querySelector("#utilitySelections .tab-pane.active").id.includes("multifamily-apartment") ? "MF" : "SFD";

		// Start with utilities reset to 0
		currentTotalUtilities = 0;

		// Handle SWG Flat Fee
		let swgFlatFeeApplied = false; // Track if the SWG flat fee has already been applied
		const swgCheckboxes = document.querySelectorAll("input[name='swg']:checked");
		swgCheckboxes.forEach((checkbox) => {
			if (!swgFlatFeeApplied) {
				const swgFlatFee = baseFees.SWG[unitType]?.flatFee || 0;
				currentTotalUtilities += swgFlatFee;
				swgFlatFeeApplied = true; // Mark flat fee as applied
			}
		});

		// Handle Add Utilities SRP and APS
		const addUtilsAPS = document.getElementById("addUtilsAPS").checked;
		const addUtilsSRP = document.getElementById("addUtilsSRP").checked;

		if (addUtilsAPS) {
			const apsFlatFee = baseFees.APS[unitType]?.flatFee || 0;
			currentTotalUtilities += apsFlatFee;
		}

		if (addUtilsSRP) {
			const srpFlatFee = baseFees.SRP[unitType]?.flatFee || 0;
			currentTotalUtilities += srpFlatFee;
		}

		// Add selected utilities from utilitySelections (SRP, APS, SWG)
		const selectedUtilities = document.querySelectorAll("input[name='srp']:checked, input[name='aps']:checked, input[name='swg']:checked");
		selectedUtilities.forEach((checkbox) => {
			const utilityProvider = checkbox.name.toUpperCase();
			const utilityCategory = checkbox.value;

			const allowance = utilityAllowances[utilityProvider]?.[unitType]?.[utilityCategory]?.[voucherSize];
			if (allowance !== undefined) currentTotalUtilities += allowance;
		});

		// Add values from #additionalUtililties checkboxes
		const idToKeyMap = {
			addUtilFridge: "refrigerator",
			addUtilRangeMicro: "rangeMicrowave",
			addUtilAcon: "airConditioning",
			addUtilWater: "water",
			addUtilSewer: "sewer",
			addUtilTrash: "trash",
			otherElec: "otherElectric",
		};

		additionalUtilityCheckboxes.forEach((checkbox) => {
			if (checkbox.checked) {
				const utilityType = idToKeyMap[checkbox.id];
				if (utilityType) {
					let additionalUtilityValue;

					// Check the selected provider for air conditioning and other utilities
					const provider = document.getElementById("addUtilsAPS").checked ? "APS" : document.getElementById("addUtilsSRP").checked ? "SRP" : null;

					if (utilityType === "airConditioning" && provider) {
						// Use the correct air conditioning override for the selected provider
						additionalUtilityValue = airConditioningOverrides[provider]?.[unitType]?.[voucherSize];
					} else if (utilityType === "otherElectric" && provider) {
						// Use the correct otherElectric values for the selected provider
						additionalUtilityValue = baseFees[provider]?.[unitType]?.otherElectric?.[voucherSize];
					} else {
						// Standard additional utilities
						additionalUtilityValue = additionalUtilities[utilityType]?.[voucherSize];
					}

					if (additionalUtilityValue !== undefined) {
						currentTotalUtilities += additionalUtilityValue;
					}
				}
			}
		});

		// Update the Total Utilities display
		totalUtilities.textContent = `$${currentTotalUtilities.toFixed(0)}`;

		// Update Gross Rent
		updateGrossRent(currentTotalUtilities);
		updateStickySection(); // Ensure the sticky section updates
	}

	// Update Sticky Section
	function updateStickySection() {
		const stickyPaymentStandard = document.getElementById("stickyPaymentStandard");
		const stickyTenantPayment = document.getElementById("stickyTenantPayment"); // New element
		const stickyGrossRent = document.getElementById("stickyGrossRent");
		const stickyIsAffordable = document.getElementById("stickyIsAffordable");

		if (stickyPaymentStandard) {
			stickyPaymentStandard.textContent = paymentStandardDisplay.textContent;
		}

		if (stickyTenantPayment) {
			stickyTenantPayment.textContent = totalTenantPayment.textContent; // Update with Tenant Payment
		}

		if (stickyGrossRent) {
			stickyGrossRent.textContent = grossRent.textContent;
		}

		if (stickyIsAffordable) {
			stickyIsAffordable.innerHTML = isAffordableElement.innerHTML;
		}
	}

	//toggles event listeners
	function toggleUtilitySections() {
		const addUtilsAPS = document.getElementById("addUtilsAPS").checked;
		const addUtilsSRP = document.getElementById("addUtilsSRP").checked;

		// Get the elements to hide or show
		const srpSections = [document.getElementById("srpSfdOptions"), document.getElementById("srpMfdOptions")];
		const apsSections = [document.getElementById("apsSfdOptions"), document.getElementById("apsMfdOptions")];

		// Hide or show sections based on the selected utility
		if (addUtilsAPS) {
			// Hide SRP sections and show APS sections
			srpSections.forEach((section) => section.classList.add("d-none"));
			apsSections.forEach((section) => section.classList.remove("d-none"));
		} else if (addUtilsSRP) {
			// Hide APS sections and show SRP sections
			apsSections.forEach((section) => section.classList.add("d-none"));
			srpSections.forEach((section) => section.classList.remove("d-none"));
		} else {
			// If neither is selected, show all sections
			srpSections.forEach((section) => section.classList.remove("d-none"));
			apsSections.forEach((section) => section.classList.remove("d-none"));
		}
	}

	// update monthly adjusted income and check affordability
	function updateMonthlyAdjustedIncome() {
		const monthlyIncome = parseFloat(monthlyAdjustedIncomeInput.value) || 0;
		const grossRentValue = parseFloat(grossRent.textContent.replace("$", "")) || 0;
		const paymentStandardValue = parseFloat(paymentStandardDisplay.textContent.replace("$", "")) || 0;
		const MAX_AFFORDABLE_PERCENT = 0.4;
		const contractRentValue = parseFloat(contractRentInput.value) || 0;

		const tenantPayment = monthlyIncome * 0.3;
		const excessRent = Math.max(0, grossRentValue - paymentStandardValue);
		const adjustedTenantPayment = tenantPayment + excessRent;
		const maxAffordablePayment = monthlyIncome * MAX_AFFORDABLE_PERCENT;

		const isAffordable = adjustedTenantPayment <= maxAffordablePayment;

		monthlyAdjustedIncomeDisplay.textContent = monthlyIncome > 0 ? `$${monthlyIncome.toFixed(0)}` : "N/A";
		totalTenantPayment.textContent = adjustedTenantPayment > 0 ? `$${adjustedTenantPayment.toFixed(0)}` : "N/A";

		if (contractRentValue > 0 && monthlyIncome > 0) {
			isAffordableElement.innerHTML = isAffordable
				? `<span class="text-success">Unit is affordable.</span>`
				: `<span class="text-danger">Unit is <strong>NOT</strong> affordable.</span>`;
		} else {
			isAffordableElement.innerHTML = "";
		}

		// Update the sticky section with the latest values
		updateStickySection();
	}

	function updateContractRent() {
		const contractRent = parseFloat(contractRentInput.value) || 0;
		contractRentDisplay.textContent = contractRent > 0 ? `$${contractRent.toFixed(0)}` : "N/A";
		baseGrossRent = contractRent;

		// update utilities and tenant payment after changing contract rent
		updateUtilityValue();
	}

	function handleUtilityExclusion(e) {
		const changedCheckbox = e.target; // The checkbox that triggered the event
		const category = changedCheckbox.value; // The utility category (e.g., "heating", "cooking", "waterHeater")

		// Select all checkboxes of the same category
		const allSimilar = document.querySelectorAll(`#utilitySelections input[type='checkbox'][value='${category}']`);

		if (changedCheckbox.checked) {
			// Disable all other checkboxes of the same category
			allSimilar.forEach((cb) => {
				if (cb !== changedCheckbox) {
					cb.disabled = true;

					// Update the label styles for the disabled checkbox
					const label = document.querySelector(`label[for='${cb.id}']`);
					if (label) {
						label.classList.remove("btn-outline-primary");
						label.classList.add("btn-outline-secondary");
					}
				}
			});
		} else {
			// Re-enable all checkboxes of the same category if the changed one is unchecked
			allSimilar.forEach((cb) => {
				if (cb !== changedCheckbox) {
					cb.disabled = false;

					// Restore the label styles for the re-enabled checkbox
					const label = document.querySelector(`label[for='${cb.id}']`);
					if (label) {
						label.classList.remove("btn-outline-secondary");
						label.classList.add("btn-outline-primary");
					}
				}
			});
		}

		// Recalculate utilities and gross rent whenever any utility checkbox is changed
		updateUtilityValue();
	}

	// attach the handleUtilityExclusion event listener to utility checkboxes, excluding #additionalUtililties
	const mainUtilityCheckboxes = document.querySelectorAll("#utilitySelections input[type='radio']");
	mainUtilityCheckboxes.forEach((checkbox) => {
		// Only attach if it's not inside #additionalUtililties
		if (!checkbox.closest("#additionalUtililties")) {
			checkbox.addEventListener("change", handleUtilityExclusion);
		}
	});

	// Event listeners
	document.getElementById("addUtilsAPS").addEventListener("change", toggleUtilitySections);
	document.getElementById("addUtilsSRP").addEventListener("change", toggleUtilitySections);

	document.getElementById("addUtilsAPS").addEventListener("change", updateUtilityValue);
	document.getElementById("addUtilsSRP").addEventListener("change", updateUtilityValue);

	voucherSelect.addEventListener("change", updatePaymentStandard);
	zipCodeSelect.addEventListener("change", updatePaymentStandard);
	monthlyAdjustedIncomeInput.addEventListener("input", updateMonthlyAdjustedIncome);
	contractRentInput.addEventListener("input", updateContractRent);

	// Attach the handleUtilityExclusion event listener to utility checkboxes
	const utilityCheckboxes = document.querySelectorAll("#utilitySelections input[type='checkbox']");
	utilityCheckboxes.forEach((checkbox) => {
		checkbox.addEventListener("change", handleUtilityExclusion);
	});

	// Use Bootstrap's `shown.bs.tab` event to handle home type selection
	const homeTypeTabs = document.querySelectorAll("#homeTypeSelection .nav-link");
	homeTypeTabs.forEach((tab) => {
		tab.addEventListener("shown.bs.tab", () => {
			updateUtilityValue(); // Recalculate utilities when the unit type changes
		});
	});

	// Initialize
	updatePaymentStandard();
	updateContractRent();
});

// reset form
function resetForm() {
	// Reset all input fields
	document.querySelectorAll("input").forEach((input) => {
		if (input.type === "checkbox" || input.type === "radio") {
			input.checked = false;
			input.disabled = false; // Re-enable any disabled checkboxes

			// Reset the label styles for checkboxes
			const label = document.querySelector(`label[for='${input.id}']`);
			if (label) {
				label.classList.remove("btn-outline-secondary");
				label.classList.add("btn-outline-primary");
			}
		} else {
			input.value = "";
		}
	});

	// Reset all dropdowns
	document.querySelectorAll("select").forEach((select) => {
		select.selectedIndex = 0;
	});

	// Clear all dynamically updated text content
	const elementsToClear = [
		"paymentStandard",
		"voucherSizeSelection",
		"zipCodeSelection",
		"monthlyAdjustedIncomeDisplay",
		"totalTenantPayment",
		"grossRent",
		"totalUtilities",
		"contractRentDisplay",
		"isAffordable",
		"maxAllowableRent",
	];
	elementsToClear.forEach((id) => {
		const element = document.getElementById(id);
		if (element) element.textContent = "";
	});

	// Reset any internal variables if needed
	currentTotalUtilities = 0;
	baseGrossRent = 0;

	// Optionally, reinitialize calculations
	updatePaymentStandard();
	updateContractRent();
}

document.getElementById("resetForm").addEventListener("click", resetForm);

// print functionality
function displayPrintButton() {
	// Select the required inputs
	let requiredInputs = document.querySelectorAll("#voucherSizeSelect, #zipCodeSelect, #monthlyAdjustedIncome, #contractRent");
	let allFilled = true;

	// Check if all required inputs have values
	requiredInputs.forEach((input) => {
		if (!input.value || input.value.trim() === "") {
			allFilled = false;
		}
	});

	// Get the print button
	const printButton = document.getElementById("printForm");

	// Show or hide the button based on whether all inputs are filled
	if (allFilled) {
		printButton.style.display = "flex";
	} else {
		printButton.style.display = "none";
	}
}

document.querySelectorAll("#voucherSizeSelect, #zipCodeSelect, #monthlyAdjustedIncome, #contractRent").forEach((input) => {
	input.addEventListener("input", displayPrintButton);
});

// Call the function initially to set the correct button visibility
displayPrintButton();

document.getElementById("printForm").addEventListener("click", () => {
	window.print();
});
