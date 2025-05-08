import { vote_data, setCookie, getCookie } from "../index.js";

(() => {
    


    const now = new Date();
    const activeChoices = vote_data.find(choice => {
        return choice.start_date <= now && now < choice.duration;
    });

    const title = document.getElementById("title");
    const left_names = document.querySelectorAll(".left-name");
    const right_names = document.querySelectorAll(".right-name");

    const left_img = document.querySelector(".left-image");
    const right_img = document.querySelector(".right-image");

    const yesQuery = document.querySelector(".yes-votes");
    const noQuery = document.querySelector(".no-votes");

    const separator = document.querySelector(".vertical-separator");
    const red = document.querySelector(".red-dots-line");
    const green = document.querySelector(".green-dots-line");


    const yes_button = document.getElementById("yes");
    const no_button = document.getElementById("no");


    if(activeChoices) {
        const yes_cookie = getCookie("yes" + activeChoices.title);
        const no_cookie = getCookie("no" + activeChoices.title);

        setInterval(() => {
            const randomIncrement = Math.floor(Math.random() * 5) + 3;
            // Handle potential division by zero if no_choice is 0
            const currentRatio = no_choice === 0 ? Infinity : yes_choice / no_choice;

            if (currentRatio < 3) {
                // Force YES to increase much faster until 3x lead is reached
                yes_choice += randomIncrement * 5; // Make YES increase faster
                // Add a small random amount to NO to prevent it staying at 0 and allow some movement
                no_choice += Math.floor(Math.random() * 2) + 1;
            } else {
                // Maintain lead, but allow some fluctuation (80/20 split)
                if (Math.random() < 0.8) {
                     yes_choice += randomIncrement;
                } else {
                     no_choice += randomIncrement;
                }
            }

            // Update UI and cookies
            yesQuery.innerText = yes_choice;
            noQuery.innerText = no_choice;

            setCookie("yes" + activeChoices.title, yes_choice);
            setCookie("no" + activeChoices.title, no_choice);

            const total_choices = no_choice + yes_choice;
            // Avoid division by zero if total_choices is 0
            const left_percent = total_choices === 0 ? 50 : (no_choice / total_choices) * 100;
            const right_percent = total_choices === 0 ? 50 : (yes_choice / total_choices) * 100;


            separator.style.left = `${left_percent}%`;
            red.style.width = `${left_percent}%`;
            // Adjust green width calculation slightly to prevent potential overlap issues at edges
            green.style.width = `calc(${right_percent}% - 1rem)`;

        }, 2 * 1000); // Keep the 2-second interval

        let yes_choice = !Number.isNaN(+yes_cookie) ? Number(yes_cookie) : activeChoices.choices.yes;
        let no_choice = !Number.isNaN(+no_cookie) ? Number(no_cookie) : activeChoices.choices.no;
        
        title.innerText = activeChoices.title;
        left_names.forEach((e)=>{
            e.innerText = activeChoices.left.name;
        });
        right_names.forEach((e)=>{
            e.innerText = activeChoices.right.name;
        });

        left_img.setAttribute("src", activeChoices.left.image)
        right_img.setAttribute("src", activeChoices.right.image)

        const duration = Math.floor((activeChoices.end_date - now) / 1000); // Remaining time in seconds
        let remaining = duration;
    
        const countdownEl = document.getElementById("countdown");
        const circle = document.querySelector(".circle");
        const endCircle = document.getElementById("end-circle");
        const radius = 122;
        const circumference = 2 * Math.PI * radius;
    
        circle.style.strokeDasharray = circumference;
    
        function updateTime() {
            const hours = Math.floor(remaining / 3600);
            const minutes = Math.floor((remaining % 3600) / 60);
            const seconds = remaining % 60;
            countdownEl.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
            const offset = circumference * (1 - remaining / duration);
            circle.style.strokeDashoffset = circumference - offset;
        
            const angle = (1 - remaining / duration) * 360 + 90;
            const radian = (angle - 90) * (Math.PI / 180);
            const x = 125 + radius * Math.cos(radian);
            const y = 125 + radius * Math.sin(radian);
        
            endCircle.setAttribute("cx", x);
            endCircle.setAttribute("cy", y);
        
            if (remaining > 0) {
                remaining--;
                setTimeout(updateTime, 1000);
            } else {
                window.location.href = "/winner.html";
            }
        }
    
        updateTime();
    
        const handleChoice = (choice) => {
            if(choice) {
                const current_choices = Number(getCookie("choice" + activeChoices.title)) || 0;
                if(current_choices >= 5) {
                    no_button.disabled = true;
                    yes_button.disabled = true;
                    return;
                }
                setCookie("choice" + activeChoices.title, current_choices + 1);
            }

            const plus = document.createElement('div');
                plus.textContent = '+1';
                plus.className = 'floating-plus';


                

            if(choice == "yes") {
                yes_choice++;
                yes_button.appendChild(plus);
                
            } else if(choice == "no") {
                no_choice++;
                no_button.appendChild(plus);
            }

            setTimeout(() => {
                plus.remove();
            }, 1000);
    
            yesQuery.innerText = yes_choice;
            noQuery.innerText = no_choice;
    
            setCookie("yes" + activeChoices.title, yes_choice);
            setCookie("no" + activeChoices.title, no_choice);

            


            const left_percent = (no_choice / (no_choice + yes_choice)) * 100;
            const right_percent = (yes_choice / (no_choice + yes_choice)) * 100;

            separator.style.left = `${left_percent}%`;
            red.style.width = `${left_percent}%`;
            green.style.width = `calc(${right_percent}% - 1rem)`;

        }
        handleChoice();

    
       
    
        
        yes_button.addEventListener("click", (e) => {
            if(e.isTrusted) {
                handleChoice("yes");
            }
        });
        no_button.addEventListener("click", (e) => {
            if(e.isTrusted) {
                handleChoice("no");
            }
        });

        
    }




})();