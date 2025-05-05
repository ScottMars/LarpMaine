(() => {
    const data = Array.from({ length: 560 }, (_, i) => ({
        wallet: "68u...RTE",
        votes: 24,
        hold: "2.3 M",
        cards: 24,
        wins: 58,
        total: "34 981"
    }));

    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const tableBody = document.getElementById("table-body");
    const pagination = document.getElementById("pagination");

    function renderTable(page) {
        tableBody.innerHTML = "";
        const start = (page - 1) * itemsPerPage + 3;
        const end = start + itemsPerPage;
        const currentItems = data.slice(start, end);

        currentItems.forEach((item, index) => {
            const rowIndex = start + index + 1;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><span class="index">${rowIndex}</span></td>
                <td>${item.wallet}</td>
                <td>${item.votes}</td>
                <td>${item.hold}</td>
                <td>${item.cards}</td>
                <td>${item.wins}</td>
                <td>${item.total}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function renderPagination(currentPage) {
        pagination.innerHTML = "";
    
        const isMobile = window.innerWidth <= 768; // breakpoint
    
        const createPageButton = (text, page, isActive = false, isDisabled = false) => {
            const btn = document.createElement("button");
            btn.innerHTML = text;
            if (isActive) btn.classList.add("active");
            if (isDisabled) btn.disabled = true;
            btn.addEventListener("click", () => {
                renderResponsive(page);
                renderPagination(page);
            });
            return btn;
        };
    
        // ← Prev
        pagination.appendChild(createPageButton(
            `<svg width="20" height="20" viewBox="0 0 25 24" fill="none"><path d="M15.5 18L9.5 12L15.5 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            currentPage - 1,
            false,
            currentPage === 1
        ));
    
        if (isMobile) {
            // MOBILE VERSION
    
            pagination.appendChild(createPageButton("1", 1, currentPage === 1));
    
            if (currentPage <= 2) {
                pagination.appendChild(createPageButton("2", 2, currentPage === 2));
                pagination.appendChild(document.createTextNode("..."));
                pagination.appendChild(createPageButton(totalPages, totalPages, currentPage === totalPages));
            } else {
                pagination.appendChild(document.createTextNode("..."));
                pagination.appendChild(createPageButton(currentPage, currentPage, true));
                if (currentPage < totalPages - 1) pagination.appendChild(document.createTextNode("..."));
                if(totalPages != currentPage) pagination.appendChild(createPageButton(totalPages, totalPages, currentPage === totalPages));
            }
    
        } else {
            // DESKTOP VERSION
    
            pagination.appendChild(createPageButton("1", 1, currentPage === 1));
    
            if (currentPage <= 3) {
                for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
                    pagination.appendChild(createPageButton(i, i, currentPage === i));
                }
                if (totalPages > 4) pagination.appendChild(document.createTextNode("..."));
            } else {
                pagination.appendChild(document.createTextNode("..."));
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
    
                for (let i = start; i <= end; i++) {
                    pagination.appendChild(createPageButton(i, i, currentPage === i));
                }
    
                if (currentPage + 1 < totalPages - 1) {
                    pagination.appendChild(document.createTextNode("..."));
                }
            }
    
            if (totalPages > 1) {
                pagination.appendChild(createPageButton(totalPages, totalPages, currentPage === totalPages));
            }
        }
    
        // → Next
        pagination.appendChild(createPageButton(
            `<svg width="20" height="20" viewBox="0 0 25 24" fill="none"><path d="M9.5 18L15.5 12L9.5 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            currentPage + 1,
            false,
            currentPage === totalPages
        ));
    }

    const cardList = document.getElementById("card-list");

    function renderCards(page) {
        cardList.innerHTML = "";
        const start = (page - 1) * itemsPerPage + 3;
        const end = start + itemsPerPage;
        const currentItems = data.slice(start, end);

        currentItems.forEach((item, index) => {
            const rowIndex = start + index + 1;
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <div class="card-header">
                    <span class="index">${rowIndex}</span>
                    <span>${item.total}</span>
                </div>
                <div class="card-content">
                    <div><span>Votes</span><span>${item.votes}</span></div>
                    <div><span>Hold amount</span><span>${item.hold}</span></div>
                    <div><span>Cards</span><span>${item.cards}</span></div>
                    <div><span>Battle wins</span><span>${item.wins}</span></div>
                </div>
            `;

            cardList.appendChild(card);
        });
    }

    function renderResponsive(page) {
        if (window.innerWidth <= 768) {
            document.querySelector("table").classList.add("hidden");
            cardList.classList.remove("hidden");
            renderCards(page);
        } else {
            document.querySelector("table").classList.remove("hidden");
            cardList.classList.add("hidden");
            renderTable(page);
        }
        renderPagination(page);
    }
    
    window.addEventListener("resize", () => renderResponsive(1));
    renderResponsive(1);
    
})();
