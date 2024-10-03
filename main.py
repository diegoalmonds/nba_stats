from flask import Flask, render_template, url_for, session, redirect
from stat_functions import *

app = Flask(__name__)

@app.route('/')
def player_page():
    reg_season = get_player_career_stats(name="Luka Doncic")
    reg_season_iterable = get_player_career_stats(name="Luka Doncic").iterrows()
    reg_totals = get_player_career_stats(name='Luka Doncic', year_by_year=False)
    post_season = get_player_career_stats(name="Luka Doncic", season_type="Post Season").iterrows()
    post_totals = get_player_career_stats(name='Luka Doncic', season_type='Post Season', year_by_year=False)
    last_season_stats = get_player_career_stats(name='Luka Doncic', stat_mode='PerGame').loc[len(reg_season)-1]
    return render_template('team_schedule.html', 
                           reg_season=reg_season_iterable, reg_season_totals=reg_totals.loc[0],
                           post_season=post_season, post_season_totals=post_totals,
                           last_season=last_season_stats)
    
@app.route('/player/<player>')
def player_home(player):
    reg_season = get_player_career_stats(name=player)
    reg_season_iterable = get_player_career_stats(name=player).iterrows()
    reg_totals = get_player_career_stats(name=player, year_by_year=False)
    post_season = get_player_career_stats(name=player, season_type="Post Season").iterrows()
    post_totals = get_player_career_stats(name=player, season_type='Post Season', year_by_year=False)
    last_season_stats = get_player_career_stats(name=player, stat_mode='PerGame').loc[len(reg_season)-1]
    return render_template("player_stats.html",
                           reg_season=reg_season_iterable, reg_season_totals=reg_totals.loc[0],
                           post_season=post_season, post_season_totals=post_totals,
                           last_season=last_season_stats)
    
@app.route('/team/<team>/schedule/<season>')
def team_schedule(team, season="2023-24"):
    parsed_team = [string.capitalize() for string in team.split('-')]
    team_parameter = ' '.join(parsed_team)
    schedule_df = get_team_schedule(team=team_parameter, season=season, season_type="Regular Season")
    return render_template('team_schedule.html',
                            schedule = schedule_df)

if __name__ == "__main__":
    app.run()