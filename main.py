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
    return render_template('player_stats.html', 
                           reg_season=reg_season_iterable, reg_season_totals=reg_totals.loc[0],
                           post_season=post_season, post_season_totals=post_totals,
                           last_season=last_season_stats)

if __name__ == "__main__":
    app.run()