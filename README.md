# SRO Tech

SRO Tech on opiston tekniikkaväen tukena toimiva mobiilisovellus. Se pitää kaiken hyödyllisen tiedon (epä)kätevästi aina mukana kännykässä - ei tarvitse louhia kalenteria ja Sheetsiä yhtä aikaa.

## Projektin yleiskuvaus

Tiedot haetaan suoraan Google Sheetsistä. Sheetsin kanssa *saattaa* tulla CORS-ongelmia (kyllä, tiedot haetaan HTTP GET-pyynnöillä :DD), sheetdb meinaan sallii vaan 500 pyyntöä kuussa ilmaisella joten ne säästetään ilmoittautumisille.
Tähän väliin huomautankin että sheetdb on ohi ja nykyään tiedot menee POSTina Json muodossa Google App scriptiin joka pyrkii parhaansa mukaan lisäämään ne sheetsiin.

Iljapuolella käytössä ovat:

- React ja TypeScript, koska koodissa pitää olla selkeys ja tyyli kohdillaan :P
- shadcn/ui ja Tailwind CSS, koska eihän normaali CSS ole riittävä
- Vite korvaa kaiken buildaustyön

## Sovelluksen ulkoasu

Typography,
vaikka eihän se esittelyä kaipaisi:

- Otsikoissa Bree Serif – tuttuun tapaan
- Muussa tekstissä Open Sans

Värit:

- Oliivinvihreä (#73AC56) – Tuttu myös mun puhelimesta
- Graniitti (#333333) – Vähän ku GRANI iitti haha :D
- Valkoinen (#FFFFFF) – Suomen Raamattuopiston Säätiö pidättää kaikki oikeudet tämän värin käyttöön
- Harmaa (#F2F2F2)

## Tiedot Google Sheetsissä

Kyhäelmä lukee taulukosta, jonka rakenne on seuraava:

| Sarake | Sisältö                        |
|--------|--------------------------------|
| A      | Päivämäärä (pp/kk/vvvv)       |
| B      | Tapahtuma ja tehtävä           |
| C      | Ilmoittautuneet vapaaehtoiset |
| D      | Varahenkilö                    |
| E      | Lisätiedot                     |

Linkki taulukkoon:  
https://docs.google.com/spreadsheets/d/1iZfopLSu7IxqF-15TYT21xEfvX_Q1-Z1OX8kzagGrDg

## Oman elämänsä webbiwelhoille:

Kloonaa repositorio:

```bash
git clone https://github.com/Sorsax/sro-tech
cd sro-tech
npm install
npm run dev
