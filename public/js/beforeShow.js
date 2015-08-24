var beforeShow = {
    // editBike: function(){

    // }  
};

var guards = {
    isLoggedIn: function(page, route, callback){
        if (m_site.token.get()) {
            util.rh.set("Authorization", "JWT " + m_site.token.get());
            var user = m_site.token.getUser();
            util.insert(user,m_site.user);
            callback();
        } else {
            console.log("guards.isLoggedIn@err: user is not logged in.");
            util.clean(m_site.user);
            util.rh.delete("Authorization");
            if (util.lc.get("autologin")) {
                m_site.auth.autologin(function(err){
                    if (!err) {
                        callback();
                    } else {
                        pager.navigate("#!/login/");
                    }
                });
            } else {
                pager.navigate("#!/login/");
            }   
        }
    },
    dc: {
        hasChosen: function(page, route, callback) {
            guards.isLoggedIn(page, route, function(){
                var id = parseInt(route[0]) || null;
                if (id!=null) {
                    var chosen = _.find(m_site.user.characters(),function(item){
                        return item.id() == id;
                    }),
                    finishCheck = function(err,chosen){
                        // console.log("guards.dc.hasChosen@err:",err,",data:",chosen);
                        if (!err && chosen) {
                            m_site.user.chosenCharacter(id);
                            m_site.user.characters.push(chosen);
                            callback();
                        } else {
                            console.log("guards.dc.hasChosen@err: Chosen character not found.");
                            pager.navigate("#!/dc/characterList/");
                        }
                    };
                    if (!chosen) {
                        dc.character.get(id,finishCheck);
                    } else {
                        finishCheck(null,chosen);
                    }
                } else {
                    console.log("guards.dc.hasChosen@err: No chosen id received.");
                    pager.navigate("#!/dc/characterList/");
                }
            });
        }
    }
};

var beforeHide = {
    dc: {
        play: function(){
            dc.play.stopSearching();
        },
        hub: {
            chat: function() {
                // m_site.socket.off('dcChat_get');
                m_site.socket.off('message');
            }
        }
    }
}