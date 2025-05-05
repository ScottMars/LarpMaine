import { vote_data, setCookie, getCookie } from "../index.js";

(()=>{
    const now = new Date();
    const activeChoices = vote_data.find(choice => {
        return choice.end_date <= now && now < choice.duration;
    });

    const winner_img = document.querySelector(".winner-image");
    const winner_name = document.querySelector(".winner-name");
    const winner_votes = document.querySelector(".winner-votes");
    const contract_element = document.getElementById("contract");

    if(activeChoices) {
        console.log(activeChoices);
        const winner_data = activeChoices[activeChoices.winner];
        winner_img.setAttribute("src", winner_data.image)
        contract_element.setAttribute('href', activeChoices.url_contract_address);
        winner_name.innerText = winner_data.name;
        winner_votes.innerText = getCookie((activeChoices.winner == "right" ? "yes" : "no") + activeChoices.title) + " VOTES";

        if(activeChoices.winner == "left") {
            winner_votes.style.color = "#FF3030";
        }

        const countdownEl = document.getElementById("countdown");

        const duration = Math.floor((activeChoices.duration - now) / 1000); // Remaining time in seconds
        let remaining = duration;

        function updateTime() {
            const hours = Math.floor(remaining / 3600);
            const minutes = Math.floor((remaining % 3600) / 60);
            const seconds = remaining % 60;
            countdownEl.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
            if (remaining > 0) {
                remaining--;
                setTimeout(updateTime, 1000);
            } else {
                window.location.href = "/vote.html";
            }
        }

        updateTime();

    } else {
        window.location.href = "/vote.html";

    }


})();