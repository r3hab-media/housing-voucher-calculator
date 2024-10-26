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
            heating: { naturalGas: [32, 39, 41, 43, 48], electric: [11, 13, 15, 17, 18] },
            cooking: { naturalGas: [6, 6, 11, 13, 17], electric: [4, 5, 8, 10, 12] },
            waterHeating: { naturalGas: [15, 19, 26, 35, 43], electric: [12, 15, 19, 23, 27] },
        },
        MF: {
            heating: { naturalGas: [26, 28, 30, 33, 35], electric: [6, 7, 9, 10, 11] },
            cooking: { naturalGas: [7, 7, 12, 14, 19], electric: [4, 5, 8, 10, 12] },
            waterHeating: { naturalGas: [14, 16, 23, 30, 37], electric: [10, 12, 15, 18, 21] },
        },
    },
    APS: {
        SFD: {
            heating: { naturalGas: [32, 39, 41, 43, 48], electric: [18, 22, 24, 27, 29] },
            cooking: { naturalGas: [6, 6, 11, 13, 17], electric: [6, 7, 10, 14, 17] },
            waterHeating: { naturalGas: [15, 19, 26, 35, 43], electric: [17, 20, 25, 31, 36] },
        },
        MF: {
            heating: { naturalGas: [26, 28, 30, 33, 35], electric: [10, 12, 14, 16, 18] },
            cooking: { naturalGas: [7, 7, 12, 14, 19], electric: [6, 7, 10, 14, 17] },
            waterHeating: { naturalGas: [14, 16, 23, 30, 37], electric: [14, 16, 20, 25, 29] },
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

// Additional utilities (i.e.; Trash, Water, Sewer, etc.)
const additionalUtilities = {
    SRP: {
        SFD: { water: [29, 29, 32, 37, 42], sewer: [18, 18, 23, 28, 32], trash: [28, 28, 28, 28, 28] },
        MF: { water: [29, 29, 32, 37, 42], sewer: [18, 18, 23, 28, 32], trash: [28, 28, 28, 28, 28] },
    },
    APS: {
        SFD: { water: [29, 29, 32, 37, 42], sewer: [18, 18, 23, 28, 32], trash: [28, 28, 28, 28, 28] },
        MF: { water: [29, 29, 32, 37, 42], sewer: [18, 18, 23, 28, 32], trash: [28, 28, 28, 28, 28] },
    },
};

// Payment standards based on voucher size and zip code
const paymentStandards = {
    0: { 85250: 1836, 85251: 1836, 85253: 2213 },
    1: { 85250: 2009, 85251: 1726, 85253: 2427 },
    2: { 85250: 2335, 85251: 2335, 85253: 2825 },
    3: { 85250: 3141, 85251: 3141, 85253: 3804 },
    4: { 85250: 3519, 85251: 3519, 85253: 4253 },
};

// Map for Voucher Size display names
const voucherSizeNames = {
    0: "Studio",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
};

// Detect tab switch and update the base fee accordingly
document.querySelectorAll('button[data-bs-toggle="tab"]').forEach((tab) => {
    tab.addEventListener("shown.bs.tab", () => {
        displayPaymentStandard();
        calculateAffordability();
    });
});

// Helper functions
function getActiveProvider() {
    return document.querySelector(".nav-tabs .nav-link.active").id.includes("srp") ? "SRP" : "APS";
}

function getFlatFee(provider, unitType) {
    return baseFees[provider][unitType]?.flatFee || 0;
}

function getVoucherSizeFee(provider, unitType, voucherSize) {
    return baseFees[provider][unitType]?.voucherSizeFees[voucherSize] || 0;
}

function displayPaymentStandard() {
    const voucherSizeValue = document.getElementById("voucherSizeSelect").value;
    const zipCode = document.getElementById("zipCodeSelect").value;

    if (voucherSizeValue && zipCode) {
        const paymentStandard = paymentStandards[voucherSizeValue]?.[zipCode] || "Not available";
        document.getElementById("paymentStandard").innerHTML = `
          <h5>Voucher Size: ${voucherSizeValue}</h5>
          <h5>Zip Code: ${zipCode}</h5>
          <h5>Payment Standard: $${paymentStandard}</h5>`;
    } else {
        document.getElementById("paymentStandard").innerHTML = `<h6>Please select both Voucher Size and Zip Code.</h6>`;
    }
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

// Parse currency input to numeric values
function parseCurrency(value) {
    return parseInt(value.replace(/[^0-9.-]+/g, "")) || 0;
}

// Get utility cost based on selections
function getUtilityCost(provider, unitType, utilityType, fuelType, voucherSize) {
    const allowances = utilityAllowances[provider][unitType][utilityType][fuelType];
    return allowances?.[voucherSize] || 0;
}

// Get selected fuel types for each utility
function getSelectedFuelTypes(provider, unitType) {
    const utilities = ["heating", "cooking", "waterHeating"];
    const selectedFuelTypes = {};

    utilities.forEach((utility) => {
        const radios = document.getElementsByName(`${provider}_${unitType}_${utility}`);
        selectedFuelTypes[utility] = Array.from(radios).find((radio) => radio.checked)?.value || "none";
    });

    return selectedFuelTypes;
}

function calculateTTP() {
    const income = parseInt(document.getElementById("monthlyAdjustedIncome").value.replace(/\D/g, "")) || 0;
    const TTP = Math.round(income * 0.3);
    document.getElementById("totalTenantPayment").value = `$${TTP.toLocaleString()}`;
    return TTP;
}

function calculateAffordability() {
    const provider = getActiveProvider();
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
    if (!monthlyIncomeValue || !contractRentValue) {
        return;
    }

    const contractRent = parseCurrency(contractRentValue);
    const monthlyIncome = parseCurrency(monthlyIncomeValue);

    let totalUtilityCosts = 0;

    // Get selected fuel types and calculate utility costs
    const selectedFuelTypes = getSelectedFuelTypes(provider, unitType);
    ["heating", "cooking", "waterHeating"].forEach((utility) => {
        const fuelType = selectedFuelTypes[utility];
        if (fuelType !== "none") {
            totalUtilityCosts += getUtilityCost(provider, unitType, utility, fuelType, voucherSize);
        }
    });

    // Add additional utility costs based on selected checkboxes
    document.querySelectorAll('.tab-pane.active input[type="checkbox"]:checked').forEach((checkbox) => {
        const utilityId = checkbox.id.split("_").slice(2).join("_").toLowerCase();
        totalUtilityCosts += additionalUtilities[provider][unitType][utilityId]?.[voucherSize] || 0;
    });

    // Calculate the base and voucher size fees
    const baseFee = getFlatFee(provider, unitType);
    const voucherSizeFee = getVoucherSizeFee(provider, unitType, voucherSize);

    // Update total utility costs with both fees
    totalUtilityCosts += baseFee + voucherSizeFee;

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

    // Clear previous appended results
    displayPaymentStandard(); // Refresh the basic information

    // Display all calculated values
    document.getElementById("paymentStandard").innerHTML += `
        <h5>Base Fee: $${baseFee.toLocaleString("en-US", { minimumFractionDigits: 0 })}</h5>
        <h5>Voucher Size Fee: $${voucherSizeFee.toLocaleString("en-US", { minimumFractionDigits: 0 })}</h5>
        <h5>Total Utilities: $${totalUtilityCosts.toLocaleString("en-US", { minimumFractionDigits: 0 })}</h5>
        <h5>Gross Rent (including utilities): $${grossRent.toLocaleString("en-US", { minimumFractionDigits: 0 })}</h5>
        <h5>Tenant Payment: $${tenantPayment.toLocaleString("en-US", { minimumFractionDigits: 0 })}</h5>
        <h5><span class="${isAffordable ? "text-success" : "text-danger"}">
            ${isAffordable ? "Unit is affordable." : "Unit is unaffordable."}
        </span></h5>`;
}

// Attach event listeners
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

// Event listener for radio buttons and checkboxes
document.addEventListener("change", (e) => {
    if (e.target.matches('input[type="radio"], input[type="checkbox"]')) {
        calculateAffordability();
    }
});

// Reset form functionality
function resetForm() {
    document.getElementById("voucherSizeSelect").value = "";
    document.getElementById("zipCodeSelect").value = "";
    document.getElementById("monthlyAdjustedIncome").value = "";
    document.getElementById("contractRent").value = "";
    document.getElementById("totalTenantPayment").value = "";
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((input) => (input.checked = false));
    document.getElementById("paymentStandard").innerHTML = `<h6>Please select both Voucher Size and Zip Code to see the Payment Standard.</h6>`;
}

document.getElementById("startOver").addEventListener("click", resetForm);

document.addEventListener("DOMContentLoaded", () => {
    displayPaymentStandard();
    calculateAffordability();
});
