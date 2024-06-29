const API_KEY = "64be657bfea2a03855f04094768eb21f1d7ca0d28918fcfc14e77e2ef36acb27"

async function fetchData(){
    try {
        const country = await fetch(`https://apiv3.apifootball.com/?action=get_countries&APIkey=${API_KEY}`);

        const countryData = await country.json();
        
        return {
            countries: countryData,
        };
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function showData(){
    const data = await fetchData();
    const countries = data.countries 

    const countryDropdown = document.getElementById('country');
    for (const country of countries) {
        const option = document.createElement("option");
        option.text = country.country_name;
        option.value = country.country_id;
        countryDropdown.appendChild(option);
    }
}

async function showLeagues(){
    const countryDropdown = document.getElementById('country');
    console.log(countryDropdown.value)

    const content = document.getElementById('content-container')
    content.innerHTML= ''
    try {
        const leagueData = await fetch(`https://apiv3.apifootball.com/?action=get_leagues&country_id=${countryDropdown.value}&APIkey=${API_KEY}`);

        const leagues = await leagueData.json();

        content.innerHTML += `
            <div class="flex justify-center mt-10 pb-20">
                <div class="overflow-x-auto">
                    <table id="league-table" class="table w-[1440px] text-[#959FA8] text-lg text-center ">
                    <!-- head -->
                    <thead>
                        <tr class="text-gray-500 font-bold text-lg border-b-2">
                        <th>No.</th>
                        <th>League Logo</th>
                        <th>League Name</th>
                        <th>Season</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                    </table>
                </div>
            </div>
        `
        for (let i = 0; i < leagues.length; i++) {
            console.log("Leagues : ", leagues[i])
            const table = document.getElementById('league-table');
            const tbody = table.querySelector('tbody');
            tbody.innerHTML += `
            <tr class="hover border-b-2">
                <td>${i + 1}</td>
                <td><img src="${leagues[i].league_logo}" alt="${leagues[i].league_name}" class="mx-auto w-20"></td>
                <td>${leagues[i].league_name}</td>
                <td>${leagues[i].league_season}</td>
                <td>
                    <div class="flex justify-center items-center">
                        <button class="view-standings-btn btn w-40 bg-gray-200" onclick="showStandings(${leagues[i].league_id})">View Standing</button>
                    </div>
                </td>
            </tr>
        `; 
        }
        
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function showStandings(league_id){
    console.log("League id : ", league_id)
    const content = document.getElementById('content-container')
    content.innerHTML= ''
    

    try {
        const standingData= await fetch(`https://apiv3.apifootball.com/?action=get_standings&league_id=${league_id}&APIkey=${API_KEY}`);

        const standings = await standingData.json();
        console.log("standing : ",standings[0])

        if(standings && standings.length > 0){
            content.innerHTML+= `
                <div class="divider mt-10 text-lg font-bold">${standings[0].league_name} Standing</div>
                    
                <div class="flex justify-center pb-20 mt-10">
                    <div class="overflow-x-auto">
                        <table id="league-table" class="table w-[1440px] text-[#959FA8] text-lg text-center ">
                        <!-- head -->
                        <thead>
                            <tr class="text-gray-500 font-bold text-lg border-b-2">
                                <th>No.</th>
                                <th>Team Name</th>
                                <th>Played</th>
                                <th>W</th>
                                <th>D</th>
                                <th>L</th>
                                <th>GF</th>
                                <th>GA</th>
                                <th>PTS</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                        </table>
                    </div>
                </div>
            `
    
            for (let i = 0; i < standings.length; i++) {
                const table = document.getElementById('league-table');
                const tbody = table.querySelector('tbody');
                tbody.innerHTML += `
                <tr class="hover border-b-2">
                    <td>${i+1}</td>
                    <td>
                        <div class="flex justify-center items-center">
                            <img src="${standings[i].team_badge}" alt="team-badge" class="size-14 mr-6">
                            <p>${standings[i].team_name}</p>
                        </div>
                    </td>
                    <td>${standings[i].overall_league_payed}</td>
                    <td>${standings[i].overall_league_W}</td>
                    <td>${standings[i].overall_league_D}</td>
                    <td>${standings[i].overall_league_L}</td>
                    <td>${standings[i].overall_league_GF}</td>
                    <td>${standings[i].overall_league_GA}</td>
                    <td>${standings[i].overall_league_PTS}</td>
                </tr>
                `
            }
        }else{
            content.innerHTML+= `<div class="divider mt-10 text-lg font-bold">No Standing Data</div>`
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

window.addEventListener('DOMContentLoaded', showData);