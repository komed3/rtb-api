'use strict';

const axios = require( 'axios' );
const fs = require( 'fs' );

async function run() {

    /**
     * fetch data
     */

    const response = await axios.get(
        'https://www.forbes.com/forbesapi/person/rtb/0/position/true.json'
    );

    if(
        response.data && response.data.personList &&
        response.data.personList.personsLists
    ) {

        let list = [];

        let total = 0,
            woman = 0;

        let stats = {
            country: {},
            industry: {}
        };

        let movers = {
            value: {},
            pct: {}
        };

        response.data.personList.personsLists.forEach( ( data ) => {

            let path = __dirname + '/profile/' + data.uri + '/',
                ts = new Date( data.timestamp ),
                date = ts.getFullYear() + '-' + ( ts.getMonth() + 1 ) + '-' + ts.getDate();

            /**
             * create new folder if not exists
             */

            if( !fs.existsSync( path ) ) {

                fs.mkdirSync( path, { recursive: true } );

            }

            /**
             * save profile info
             */

            let info = {
                name: data.person.name || data.personName || null,
                gender: data.gender.toLowerCase() || null,
                birthDate: data.birthDate
                    ? new Date( data.birthDate )
                    : null,
                citizenship: data.countryOfCitizenship || null,
                state: data.state || null,
                city: data.city || null,
                source: data.source || null,
                industries: data.industries || null
            };

            fs.writeFileSync(
                path + 'info.json',
                JSON.stringify( info, null, 2 ),
                { flag: 'w' }
            );

            /**
             * save bios
             */

            fs.writeFileSync(
                path + 'bio.json',
                JSON.stringify( data.bios || null, null, 2 ),
                { flag: 'w' }
            );

            /**
             * save financial assets
             */

            fs.writeFileSync(
                path + 'assets.json',
                JSON.stringify( data.financialAssets || null, null, 2 ),
                { flag: 'w' }
            );

            /**
             * update net worth data
             */

            let networth = Number( parseFloat( data.finalWorth || 0 ).toFixed( 3 ) );

            let latest = null,
                change = null;

            if( fs.existsSync( path + 'networth.json' ) ) {

                latest = JSON.parse( fs.readFileSync( path + 'networth.json' ) );

                if( latest.value && networth != latest.value ) {

                    let cng = networth - latest.value;

                    change = {
                        value: Number( cng.toFixed( 3 ) ),
                        pct: Number( ( cng / networth * 100 ).toFixed( 3 ) ),
                        date: date
                    };

                }

            }

            fs.writeFileSync(
                path + 'networth.json',
                JSON.stringify( {
                    value: networth,
                    change: change,
                    private: parseFloat( data.privateAssetsWorth || 0 ),
                    archived: parseFloat( data.archivedWorth || 0 )
                } || null, null, 2 ),
                { flag: 'w' }
            );

            /**
             * update net worth history (chart data)
             */

            if( change != null || latest == null ) {

                fs.appendFileSync(
                    path + 'history.csv',
                    date + ' ' + networth + '\r\n',
                    { flag: 'a' }
                );

            }

            /**
             * save rank and list data
             * requires net worth > $1B
             */

            if( data.rank && networth >= 1000 ) {

                fs.writeFileSync(
                    path + 'rank.json',
                    JSON.stringify( {
                        rank: data.rank,
                        date: date
                    } || null, null, 2 ),
                    { flag: 'w' }
                );

                list.push( {
                    rank: data.rank,
                    uri: data.uri,
                    name: info.name,
                    gender: info.gender,
                    age: info.birthDate ? new Date(
                        new Date() - new Date( info.birthDate )
                    ).getFullYear() - 1970 : null,
                    country: info.citizenship,
                    industries: info.industries,
                    source: info.source,
                    networth: networth,
                    change: change
                } );

                total += networth;

                if( info.gender == 'f' ) {

                    woman++;

                }

            }

            /**
             * calculate stats & daily movers
             */

            if( change != null ) {

                if( info.industries && info.industries.length > 0 ) {

                    info.industries.forEach( ( i ) => {

                        if( !( i in stats.industry ) ) {

                            stats.industry[ i ] = {
                                value: 0,
                                count: 0
                            };

                        }

                        stats.industry[ i ].value += change.pct;
                        stats.industry[ i ].count++;

                    } );

                }

                if( info.citizenship ) {

                    if( !( info.citizenship in stats.country ) ) {

                        stats.country[ info.citizenship ] = {
                            value: 0,
                            count: 0
                        };

                    }

                    stats.country[ info.citizenship ].value += change.pct;
                    stats.country[ info.citizenship ].count++;

                }

                movers.value[ data.uri ] = change.value;
                movers.pct[ data.uri ] = change.pct;

            }

            /**
             * save last touched timestamp
             */

            fs.writeFileSync(
                path + 'timestamp',
                ( new Date( data.timestamp ) ).toISOString(),
                { flag: 'w' }
            );

        } );

        /**
         * save daily list
         */

        let ts = new Date(),
            today = ts.getFullYear() + '-' + ( ts.getMonth() + 1 ) + '-' + ts.getDate(),
            stream = '';

        stream = JSON.stringify( {
            date: today,
            count: list.length,
            woman: woman,
            total: Number( total.toFixed( 3 ) ),
            list: list
        }, null, 2 );

        fs.writeFileSync(
            __dirname + '/list/' + today + '.json',
            stream, { flag: 'w' }
        );

        fs.writeFileSync(
            __dirname + '/list/latest.json',
            stream, { flag: 'w' }
        );

        /**
         * save stats
         */

        fs.appendFileSync(
            __dirname + '/stats/count.csv',
            today + ' ' + list.length + '\r\n',
            { flag: 'a' }
        );

        fs.appendFileSync(
            __dirname + '/stats/woman.csv',
            today + ' ' + woman + '\r\n',
            { flag: 'a' }
        );

        fs.appendFileSync(
            __dirname + '/stats/total.csv',
            today + ' ' + total.toFixed( 3 ) + '\r\n',
            { flag: 'a' }
        );

        /**
         * track worth changes
         */

        for( const [ key, entries ] of Object.entries( stats ) ) {

            for( const [ k, v ] of Object.entries( entries ) ) {

                fs.appendFileSync(
                    __dirname + 'stats/' + key + '/' + ( k
                        .toLowerCase()
                        .replace( /[^a-z0-9-]/g, '-' )
                        .replace( /-{1,}/g, '-' )
                        .trim()
                    ) + '.csv',
                    today + ' ' + (
                        v.value / v.count
                    ).toFixed( 3 ) + '\r\n',
                    { flag: 'a' }
                );

            }

        }

        /**
         * calculate daily movers
         */

        let _movers = {
            value: {
                winner: {},
                loser: {}
            },
            pct: {
                winner: {},
                loser: {}
            }
        };

        if( Object.keys( movers.value ).length ) {

            _movers.value.winner = Object.entries( movers.value ).filter(
                ( [ ,a ] ) => a > 0
            ).sort(
                ( [ ,a ], [ ,b ] ) => b - a
            ).slice( 0, 10 );

            _movers.value.loser = Object.entries( movers.value ).filter(
                ( [ ,a ] ) => a < 0
            ).sort(
                ( [ ,a ], [ ,b ] ) => a - b
            ).slice( 0, 10 );

        }

        if( Object.keys( movers.pct ).length ) {

            _movers.pct.winner = Object.entries( movers.pct ).filter(
                ( [ ,a ] ) => a > 0
            ).sort(
                ( [ ,a ], [ ,b ] ) => b - a
            ).slice( 0, 10 );

            _movers.pct.loser = Object.entries( movers.pct ).filter(
                ( [ ,a ] ) => a < 0
            ).sort(
                ( [ ,a ], [ ,b ] ) => a - b
            ).slice( 0, 10 );

        }

        /**
         * save daily movers
         */

        stream = JSON.stringify( _movers, null, 2 );

        fs.writeFileSync(
            __dirname + '/movers/' + today + '.json',
            stream, { flag: 'w' }
        );

        fs.writeFileSync(
            __dirname + '/movers/latest.json',
            stream, { flag: 'w' }
        );

    }

}

run();