const API_KEY = "c120fedf6674e771f5af2e7fb14750813d7f479bab5f09c39dab738fab2f56f2"

async function fetchData(){
    try {
        const league = await fetch(`https://apiv3.apifootball.com/?action=get_leagues&APIkey=${API_KEY}`);

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

    const leagues = data.leagues

    for (let i = 0; i < 10; i++) { // for (let i = 0; i < leagues.length; i++) -> for get all leagues data
        const topStanding = await fetch(`https://apiv3.apifootball.com/?action=get_standings&league_id=${leagues[i].league_id}&APIkey=${API_KEY}`);
        const topStandingData = await topStanding.json()
        console.log("League ID : ",leagues[i].league_id)

        if (topStandingData && topStandingData.length > 0 && topStandingData[0].team_badge && topStandingData[0].team_name) {
            topTeamHTML = `
                <img src="${topStandingData[0].team_badge}" alt="team-badge" class="size-14 mr-6">
                <p>${topStandingData[0].team_name}</p>
            `;
        }else{
            topTeamHTML = `<p>Empty</p>`;
        }



        tbody.innerHTML += `
            <tr class="hover border-b-2">
                <td>${i + 1}</td>
                <td><img src="${leagues[i].league_logo}" alt="${leagues[i].league_name}" class="mx-auto w-20"></td>
                <td>${leagues[i].league_name}</td>
                <td>${leagues[i].league_season}</td>
                <td>
                    <div class="flex justify-center items-center">
                    ${topTeamHTML}
                    </div>
                </td>
            </tr>
        `;
    }
}

window.addEventListener('DOMContentLoaded', showData);