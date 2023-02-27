const submitBtn = document.getElementById("submit-btn");
const addBtn = document.getElementById("add-btn");
const form = document.getElementById("column-1");
const card = document.getElementById("column-2");
const formHidden = localStorage.getItem("formHidden") === "true";
const moneyLeft = document.getElementById("money-left-id");

if (formHidden) {
	form.classList.add("d-none");
	card.classList.remove("d-none");
	const retrievedBudgetForm = JSON.parse(localStorage.getItem("BudgetForm"));
	moneyLeft.innerText = retrievedBudgetForm[0].moneyLeft.toString();
	displayExpenseItems();
} else {
	form.classList.remove("d-none");
	card.classList.add("d-none");
}
function formToggle() {
	form.classList.toggle("d-none");
	card.classList.toggle("d-none");
	localStorage.setItem("formHidden", form.classList.contains("d-none"));
}

function getMonthDays(monthIndex) {
	let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	return monthDays[monthIndex];
}

function addBudget(e) {
	e.preventDefault();
	const budgetData = [];

	if (
		document.getElementById("income").value &&
		document.getElementById("savings").value
	) {
		const budget = {
			days: getMonthDays(new Date().getMonth()),
			income: parseInt(document.getElementById("income").value),
			savings: parseInt(document.getElementById("savings").value),
		};
		budgetData.push(budget);
		document.forms[0].reset();

		console.warn("added", { budgetData });

		localStorage.setItem("BudgetForm", JSON.stringify(budgetData));
		const retrievedBudgetForm = JSON.parse(localStorage.getItem("BudgetForm"));
		const result =
			retrievedBudgetForm[0].income - retrievedBudgetForm[0].savings;
		moneyLeft.innerText = result.toString();

		formToggle();
	}
}

function getCategory(categoryIndex) {
	let categories = ["", "Food", "Entertainment", "Utilities", "Others"];
	return categories[categoryIndex];
}

function createList() {
	const list = document.querySelector("ul");
	const listItem = document.createElement("li");
	const para = document.createElement("p");
	para.id = "expVal";
	const para2 = document.createElement("p");
	para2.id = "expCat";
	const btn = document.createElement("button");
	btn.classList.add("btn", "btn-danger");
	btn.textContent = "X";
	btn.addEventListener("click", function () {
		this.parentElement.remove();
	});
	listItem.append(para, para2, btn);

	list.append(listItem);
	//
	return {
		para: para,
		para2: para2,
	};
}
function addExpense() {
	const { para, para2 } = createList(); // najpierw wykonuje sie funkcja createList, tworzy sie element list item dodany do listy
	// funkcja zwraca zmienne para i para2 ktorym przypisane sa wa
	const expenseVal = document.getElementById("expense-value").value;
	const expenseCat = getCategory(
		document.getElementById("expense-category").value
	);
	subtractExpense(expenseVal);
	para.textContent = expenseVal;
	para2.textContent = expenseCat;
	const expenseItem = {
		value: expenseVal,
		category: expenseCat,
	};
	const existingItems = JSON.parse(localStorage.getItem("expenseItems")) || [];
	existingItems.push(expenseItem);
	localStorage.setItem("expenseItems", JSON.stringify(existingItems));
}

function subtractExpense(expenseVal) {
	const budgetData = [];
	let result;
	const retrievedBudgetForm = JSON.parse(localStorage.getItem("BudgetForm"));
	retrievedBudgetForm[0].expense = parseInt(expenseVal);
	if ("moneyLeft" in retrievedBudgetForm[0]) {
		result = retrievedBudgetForm[0].moneyLeft - retrievedBudgetForm[0].expense;
		document.getElementById("money-left-id").innerText = result.toString();
	} else {
		retrievedBudgetForm[0].moneyLeft =
			retrievedBudgetForm[0].income -
			retrievedBudgetForm[0].savings -
			retrievedBudgetForm[0].expense;
		result = retrievedBudgetForm[0].moneyLeft;

		document.getElementById("money-left-id").innerText = result.toString();
	}

	const budget = {
		income: retrievedBudgetForm[0].income,
		savings: retrievedBudgetForm[0].savings,
		expense: retrievedBudgetForm[0].expense,
		moneyLeft: result,
	};
	budgetData.push(budget);
	localStorage.setItem("BudgetForm", JSON.stringify(budgetData));
}

function displayExpenseItems() {
	// Get the list of expense items from local storage
	const expenseItems = JSON.parse(localStorage.getItem("expenseItems")) || [];

	// Loop through the list of expense items and create a new list item for each item
	expenseItems.forEach((expenseItem) => {
		const { para, para2 } = createList();
		para.textContent = expenseItem.value;
		para2.textContent = expenseItem.category;
	});
}

document.addEventListener("DOMContentLoaded", () => {
	submitBtn.addEventListener("click", addBudget);
	addBtn.addEventListener("click", addExpense);
});

/* usunac element dodany na liste
co sie dzieje - klikam przycisk, element znika z dom representation
dodaje sie z powrotem suma do money left






*/
// dodac dane karty do local storage za kazdym razem jak dodaje je na strone,
// jezeli istnieje juz kategoria ktora dodaje w liscie, dodac wartosc do tego ekspensu
// konwerter waluty

// poprawic widok, na desktopie apka powinna byc na srodku, nie z lewej strony
