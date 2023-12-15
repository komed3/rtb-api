'use strict';

const api = 'https://www.forbes.com/forbesapi/person/rtb/0/position/true.json';
const today = ( new Date() ).toISOString().split( 'T' )[0];

const axios = require( 'axios' );
const fs = require( 'fs' );

async function run() {

    /**
     * create folders (if not exists)
     */

    [
        '/list/rtb/',
        '/movers/pct/winner/',
        '/movers/pct/loser/',
        '/movers/value/winner/',
        '/movers/value/loser/',
        '/profile/',
        '/stats/country/',
        '/stats/industry/'
    ].forEach( ( dir ) => {

        fs.mkdirSync( __dirname + dir, { recursive: true } );

    } );

    /**
     * fetch data
     */

    const response = await axios.get( api );

    if(
        response.data && response.data.personList &&
        response.data.personList.personsLists
    ) {

        let list = [];

        let stats = {
            total: 0,
            count: 0,
            woman: 0,
            industry: {},
            country: {}
        };

        let movers = {
            value: {},
            pct: {}
        };

        /**
         * run through profiles
         */

        response.data.personList.personsLists.forEach( ( profile ) => {

            let uri = profile.uri.trim(),
                ts = ( new Date( profile.timestamp ) ).toISOString().split( 'T' )[0],
                path = __dirname + '/profile/' + uri + '/';

            /**
             * create new folder if not exists
             */

            if( !fs.existsSync( path ) ) {

                fs.mkdirSync( path, { recursive: true } );

            }

            /**
             * basic profile info
             */

            let birthDate = profile.birthDate
                ? new Date( profile.birthDate )
                : null;

            let info = {
                uri: uri,
                name: ( profile.person.name || profile.personName || '' ).trim(),
                gender: profile.gender
                    ? profile.gender.toLowerCase()
                    : null,
                birthDate: birthDate,
                age: birthDate
                    ? new Date(
                          new Date() - new Date( birthDate )
                      ).getFullYear() - 1970
                    : null,
                citizenship: profile.countryOfCitizenship || null,
                state: profile.state || null,
                city: profile.city || null,
                industries: [].concat( profile.industries || [] ),
                source: ( profile.source || '' ).trim().split( ', ' )
            };

            fs.writeFileSync(
                path + 'info',
                JSON.stringify( info, null, 2 ),
                { flag: 'w' }
            );

            fs.writeFileSync(
                path + 'bio',
                JSON.stringify( [].concat( profile.bios || [] ), null, 2 ),
                { flag: 'w' }
            );

            /**
             * financial assets
             */

            fs.writeFileSync(
                path + 'assets',
                JSON.stringify( [].concat( profile.financialAssets || [] ), null, 2 ),
                { flag: 'w' }
            );

            /**
             * net worth
             */

            let networth = Number( parseFloat( profile.finalWorth || 0 ).toFixed( 3 ) );

            let latest = null,
                change = null;

            if( fs.existsSync( path + 'networth' ) ) {

                latest = JSON.parse( fs.readFileSync( path + 'networth' ) );

                if( latest.value && networth != latest.value ) {

                    let cng = networth - latest.value;

                    change = {
                        value: Number( cng.toFixed( 3 ) ),
                        pct: Number( ( cng / networth * 100 ).toFixed( 3 ) ),
                        date: ts
                    };

                }

            }

            fs.writeFileSync(
                path + 'networth',
                JSON.stringify( {
                    date: ts,
                    value: networth,
                    change: change,
                    private: parseFloat( profile.privateAssetsWorth || 0 ),
                    archived: parseFloat( profile.archivedWorth || 0 )
                }, null, 2 ),
                { flag: 'w' }
            );

            /**
             * rank and list data
             * requires net worth > $1B
             */

            if( profile.rank && networth >= 1000 ) {

                fs.writeFileSync(
                    path + 'rank',
                    JSON.stringify( {
                        rtb: {
                            date: ts,
                            rank: profile.rank
                        }
                    } || null, null, 2 ),
                    { flag: 'w' }
                );

            }

            /**
             * append history
             */

            if( latest == null || latest.date != ts ) {

                fs.appendFileSync(
                    path + 'history',
                    ts + ' ' + ( profile.rank || '' ) + ' ' + networth + '\r\n',
                    { flag: 'a' }
                );

            }

            /**
             * stats
             */

            if( info.gender == 'f' ) {

                stats.woman++;

            }

            process.exit(1);

        } );

    }

    /**
     * create profiles list
     */

    fs.readdir( __dirname + '/profile/', ( err, files ) => {

        let list = [];

        files.forEach( ( file ) => {

            if( fs.lstatSync( __dirname + '/profile/' + file ).isDirectory() ) {

                list.push( file );

            }

        } );

        fs.writeFileSync(
            __dirname + '/profile/list',
            JSON.stringify( list, null, 2 ),
            { flag: 'w' }
        );

    } );

}

run();