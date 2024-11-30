function initializeDualSelect(sourceSelect, targetSelect, filterInput) {
    filterInput.addEventListener('input', () => {
        filterSelect(sourceSelect, filterInput.value);
    });

    sourceSelect.addEventListener('dblclick', () => {
        moveSelectedOptions(sourceSelect, targetSelect);
    });

    targetSelect.addEventListener('dblclick', () => {
        moveSelectedOptions(targetSelect, sourceSelect);
    });
}

function moveSelectedOptions(sourceSelect, targetSelect) {
    const selectedOptions = [...sourceSelect.selectedOptions];

    for (const option of selectedOptions) {
        targetSelect.appendChild(option);
    }
}

function filterSelect(select, filter) {
    const options = select.options;

    for (let i = 0; i < options.length; i++) {
        const option = options[i];

        if (option.textContent.toLowerCase().includes(filter.toLowerCase())) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    }
}
