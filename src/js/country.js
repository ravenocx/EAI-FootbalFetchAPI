const API_KEY = "64be657bfea2a03855f04094768eb21f1d7ca0d28918fcfc14e77e2ef36acb27"

async function fetchData(){
    try {
        const country = await fetch(`https://apiv3.apifootball.com/?action=get_countries&APIkey=${API_KEY}`);
        const league = await fetch(`https://apiv3.apifootball.com/?action=get_leagues&APIkey=${API_KEY}`);

        const countryData = await country.json();
        const leagueData = await league.json();
        
        let uniqueLeagues = []

        for(const league of leagueData){
            const existingLeague = uniqueLeagues.find(item => item.league_name === league.league_name);
            // If no league with the same league_name is found, add it to the uniqueLeagues array
            if (!existingLeague) {
                uniqueLeagues.push(league);
            }
        }

        return {
            countries: countryData,
            leagues: uniqueLeagues,
        };
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function showData(){
    const data = await fetchData();
    const table = document.getElementById('country-table');
    const tbody = table.querySelector('tbody');

    const countries = data.countries
    const leagues = data.leagues

    for (let i = 0; i < 10; i++) { // for (let i = 0; i < countries.length; i++) -> for get all country data
        let leagueCountry = []
        for (const league of leagues) {
            if (league.country_id === countries[i].country_id){
                const existingLeague = leagueCountry.find(item => item.league_name === league.league_name);
                // If no league with the same league_name is found, add it to the uniqueLeagues array
                if (!existingLeague) {
                    leagueCountry.push(league);
                }
            } 
        }

        let countryTeams = []
        for(const league of leagueCountry){
            const countryTeam = await fetch(`https://apiv3.apifootball.com/?action=get_teams&league_id=${league.league_id}&APIkey=${API_KEY}`);
            const teams = await countryTeam.json()
            console.log("teams",teams)

            
            for(let team of teams){
                const existingLeague = countryTeams.find(item => item.team_name === team.team_name);

                if(!existingLeague){
                    countryTeams.push(team)
                }
            }
        }
        tbody.innerHTML += `
            <tr class="hover border-b-2 h-[90px]">
                <td>${i + 1}</td>
                <td><img src="${countries[i].country_logo}" alt="${countries[i].country_name}" class="mx-auto w-20"></td>
                <td>${countries[i].country_name}</td>
                <td>${leagueCountry.length}</td>
                <td>${countryTeams.length}</td>
            </tr>
        `;
    }
}

window.addEventListener('DOMContentLoaded', showData);