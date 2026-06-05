import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Trophy, Search, Columns, Download, ArrowUpDown } from 'lucide-react';

type Row = {
  institution: string;
  division: string;
  conference: string;
  region: string;
  state: string;
  mens_coach: string;
  mens_email: string;
  mens_phone: string;
  womens_coach: string;
  womens_email: string;
  womens_phone: string;
  notes: string;
};

const DATA: Row[] = [
  // SWAC D-I
  { institution: 'Alabama A&M University', division: 'NCAA D-I', conference: 'SWAC', region: 'Southeast', state: 'AL', mens_coach: 'Devins Jackson', mens_email: 'devins.jackson@aamu.edu', mens_phone: '', womens_coach: '—', womens_email: '', womens_phone: '', notes: "Men's only – D'Wayne Robinson serves as head coach & Senior Associate AD" },
  { institution: 'Alabama State University', division: 'NCAA D-I', conference: 'SWAC', region: 'Southeast', state: 'AL', mens_coach: 'Quincy Heard', mens_email: 'qheard@alasu.edu', mens_phone: '360-836-7711', womens_coach: 'Quincy Heard', womens_email: 'qheard@alasu.edu', womens_phone: '360-836-7711', notes: "Coach Heard leads both; women 3x SWAC champs (2022-24); 2026 SWAC Women's Individual Champ – Carmen Fletcher" },
  { institution: 'Bethune-Cookman University', division: 'NCAA D-I', conference: 'SWAC', region: 'Southeast', state: 'FL', mens_coach: 'TBD / Vacant', mens_email: '', mens_phone: '', womens_coach: 'Harry Stokes', womens_email: '', womens_phone: '', notes: "Stokes is 2024 SWAC Co-Coach of Year; men's coaching status TBD" },
  { institution: 'Florida A&M University', division: 'NCAA D-I', conference: 'SWAC', region: 'Southeast', state: 'FL', mens_coach: 'Mike Rice', mens_email: 'preston.rice@famu.edu', mens_phone: '850-212-7801', womens_coach: '—', womens_email: '', womens_phone: '', notes: "Men's only – 2025 SWAC Champions; 2024 PGA WORKS HBCU National Champions; first D-I to win MEAC & SWAC golf titles" },
  { institution: 'Jackson State University', division: 'NCAA D-I', conference: 'SWAC', region: 'Southeast', state: 'MS', mens_coach: 'Rob Ford II', mens_email: 'robert.ford@jsums.edu', mens_phone: '832-986-6541', womens_coach: 'Rob Ford II', womens_email: 'robert.ford@jsums.edu', womens_phone: '', notes: 'REINSTATED 2025 – both programs dormant since 2017; JSU men won 25 SWAC titles, women 14' },
  { institution: 'Prairie View A&M University', division: 'NCAA D-I', conference: 'SWAC', region: 'South-Central', state: 'TX', mens_coach: 'Kortland Ware', mens_email: 'krware@pvamu.edu', mens_phone: '', womens_coach: 'Kortland Ware', womens_email: 'krware@pvamu.edu', womens_phone: '', notes: "Ware hired July 2025 (both programs); 2024 Non-D1 HBCU Coach of Year; 2026 SWAC Women's Champions" },
  { institution: 'Southern University (Baton Rouge)', division: 'NCAA D-I', conference: 'SWAC', region: 'South-Central', state: 'LA', mens_coach: 'Bobby Pope', mens_email: 'bobby.pope@sus.edu', mens_phone: '225-978-1317', womens_coach: 'Bobby Pope', womens_email: 'bobby.pope@sus.edu', womens_phone: '', notes: "Both reinstated 2023; 2025 SWAC Women's Individual Champ – Salma Ibrahim; Pope 2025 SWAC Co-Coach of Year" },
  { institution: 'Texas Southern University', division: 'NCAA D-I', conference: 'SWAC', region: 'South-Central', state: 'TX', mens_coach: 'Willie Shankle', mens_email: 'willie.shankle@tsu.edu', mens_phone: '713-416-2108', womens_coach: 'Willie Shankle', womens_email: 'willie.shankle@tsu.edu', womens_phone: '', notes: "Shankle leads both; 2022 & 2023 SWAC Men's Champions" },
  { institution: 'University of Arkansas at Pine Bluff', division: 'NCAA D-I', conference: 'SWAC', region: 'South-Central', state: 'AR', mens_coach: 'Roger Totten', mens_email: 'tottenr@uapb.edu', mens_phone: '870-329-0647', womens_coach: '—', womens_email: '', womens_phone: '', notes: "Men's only – 5x SWAC Coach of Year; 2023/24/26 SWAC Champions; 2025 PGA WORKS HBCU National Champs" },
  // MEAC/NEC/CAA/OVC D-I
  { institution: 'Coppin State University', division: 'NCAA D-I', conference: 'MEAC / NEC', region: 'Mid-Atlantic', state: 'MD', mens_coach: '', mens_email: '', mens_phone: '', womens_coach: '', womens_email: '', womens_phone: '', notes: '' },
  { institution: 'Delaware State University', division: 'NCAA D-I', conference: 'MEAC / NEC', region: 'Mid-Atlantic', state: 'DE', mens_coach: '—', mens_email: '', mens_phone: '252-562-4497', womens_coach: 'Craig Bowen', womens_email: 'cbowen@desu.edu', womens_phone: '', notes: "Women's golf only; Bowen named head coach Sept 2024; former BCGCA president" },
  { institution: 'Howard University', division: 'NCAA D-I', conference: 'MEAC / NEC', region: 'Mid-Atlantic', state: 'DC', mens_coach: 'Sam Puryear', mens_email: 'samuel.puryear@howard.edu', mens_phone: '202-430-0141', womens_coach: 'Sam Puryear', womens_email: 'samuel.puryear@howard.edu', womens_phone: '202-430-0141', notes: "Director of Golf leads both; NEC Men's Champs 2024-25; Steph Curry-supported program" },
  { institution: 'Morgan State University', division: 'NCAA D-I', conference: 'MEAC / NEC', region: 'Mid-Atlantic', state: 'MD', mens_coach: '', mens_email: '', mens_phone: '', womens_coach: '', womens_email: '', womens_phone: '', notes: '' },
  { institution: 'Norfolk State University', division: 'NCAA D-I', conference: 'MEAC / NEC', region: 'Mid-Atlantic', state: 'VA', mens_coach: 'Interim Head Coach', mens_email: '', mens_phone: '', womens_coach: '', womens_email: '', womens_phone: '', notes: '' },
  { institution: 'North Carolina A&T State University', division: 'NCAA D-I', conference: 'CAA / MEAC', region: 'Southeast', state: 'NC', mens_coach: 'Mesha Levister', mens_email: 'jslevister@ncat.edu', mens_phone: '919-720-9884', womens_coach: 'Mesha Levister', womens_email: 'jslevister@ncat.edu', womens_phone: '', notes: 'Director of Golf June 2025 (from PVAMU); 2025 HBCU SAS Invitational Champions (M&W)' },
  { institution: 'North Carolina Central University', division: 'NCAA D-I', conference: 'MEAC / NEC', region: 'Southeast', state: 'NC', mens_coach: 'Kendall Wallace', mens_email: 'awalla49@nccu.edu', mens_phone: '803-415-2890', womens_coach: 'Kendall Wallace', womens_email: 'awalla49@nccu.edu', womens_phone: '', notes: 'NEC/MEAC affiliate for golf since 2022' },
  { institution: 'Tennessee State University', division: 'NCAA D-I', conference: 'Ohio Valley Conference', region: 'Southeast', state: 'TN', mens_coach: 'Parrish McGrath', mens_email: 'pmcgrath@tnstate.edu', mens_phone: '615-491-2469', womens_coach: 'Parrish McGrath', womens_email: 'pmcgrath@tnstate.edu', womens_phone: '', notes: 'Director of M&W Golf since 2012; Dr. Catana Starks was first woman to coach a men’s D-I golf team' },
  { institution: 'University of Maryland Eastern Shore', division: 'NCAA D-I', conference: 'MEAC / NEC', region: 'Mid-Atlantic', state: 'MD', mens_coach: 'Jerel Walker', mens_email: 'jmwalker2@umes.edu', mens_phone: '601-212-6192', womens_coach: 'Jerel Walker', womens_email: 'jmwalker2@umes.edu', womens_phone: '', notes: 'PGA Golf Management host institution' },
  // CIAA D-II
  { institution: 'Bluefield State University', division: 'NCAA D-II', conference: 'CIAA', region: 'Southeast', state: 'WV', mens_coach: 'Garry Moore', mens_email: '', mens_phone: '304-887-4568', womens_coach: 'Sam Berry', womens_email: 'sberry@bluefieldstate.edu', womens_phone: '', notes: "2025 CIAA Men's Champs; 2026 CIAA Coach of Year; 2025 NCAA Regional qualifiers" },
  { institution: 'Bowie State University', division: 'NCAA D-II', conference: 'CIAA', region: 'Mid-Atlantic', state: 'MD', mens_coach: 'Edric Poitier', mens_email: 'epoitier@bowiestate.edu', mens_phone: '301-860-3583', womens_coach: '—', womens_email: '', womens_phone: '', notes: 'NEW PROGRAM 2025-26 – inaugural season; first-ever NCAA golf program at Bowie State' },
  { institution: 'Elizabeth City State University', division: 'NCAA D-II', conference: 'CIAA', region: 'Southeast', state: 'NC', mens_coach: 'Nicholas Sanders', mens_email: '', mens_phone: '', womens_coach: '—', womens_email: '', womens_phone: '', notes: "Men's only; 12th at 2025 CIAA Championship" },
  { institution: 'Fayetteville State University', division: 'NCAA D-II', conference: 'CIAA', region: 'Southeast', state: 'NC', mens_coach: 'Zane Lewis', mens_email: 'zlewis12@uncfsu.edu', mens_phone: '', womens_coach: '—', womens_email: '', womens_phone: '', notes: '2026 CIAA Champions; 2025 HBCU SAS Invitational Div II Champions' },
  { institution: 'Johnson C. Smith University', division: 'NCAA D-II', conference: 'CIAA', region: 'Southeast', state: 'NC', mens_coach: 'William Watkins', mens_email: 'wwatkins@jcsu.edu', mens_phone: '704-315-1127', womens_coach: '—', womens_email: '', womens_phone: '', notes: '7th at 2026 CIAA Championship' },
  { institution: 'Livingstone College', division: 'NCAA D-II', conference: 'CIAA', region: 'Southeast', state: 'NC', mens_coach: 'Andre Springs', mens_email: 'asprings@livingstone.edu', mens_phone: '704-216-6012', womens_coach: '—', womens_email: '', womens_phone: '', notes: '2025 CIAA Coach of Year; 2025 CIAA Southern Division Champs' },
  { institution: 'Virginia State University', division: 'NCAA D-II', conference: 'CIAA', region: 'Southeast', state: 'VA', mens_coach: 'Justin Parker', mens_email: 'jmparker@vsu.edu', mens_phone: '804-524-5028', womens_coach: '—', womens_email: '', womens_phone: '', notes: '4th at 2026 CIAA Championship' },
  { institution: 'Virginia Union University', division: 'NCAA D-II', conference: 'CIAA', region: 'Southeast', state: 'VA', mens_coach: 'E. Lee Coble', mens_email: 'elcoble@vuu.edu', mens_phone: '804-257-5677', womens_coach: '—', womens_email: '', womens_phone: '', notes: '2025 CIAA Northern Division Champs; 3.82 team GPA' },
  { institution: 'Winston-Salem State University', division: 'NCAA D-II', conference: 'CIAA', region: 'Southeast', state: 'NC', mens_coach: 'Charles Penny II', mens_email: 'pennycw@wssu.edu', mens_phone: '336-750-2141', womens_coach: '—', womens_email: '', womens_phone: '', notes: '2026 CIAA runner-up; Cameron Lutterloh won 2026 CIAA individual title' },
  // SIAC D-II
  { institution: 'Albany State University', division: 'NCAA D-II', conference: 'SIAC', region: 'Southeast', state: 'GA', mens_coach: 'Roger Shurling', mens_email: '', mens_phone: '', womens_coach: '—', womens_email: '', womens_phone: '', notes: "Men's only" },
  { institution: 'Kentucky State University', division: 'NCAA D-II', conference: 'SIAC', region: 'Southeast', state: 'KY', mens_coach: 'Mike Grugin', mens_email: 'Mike.Grugin@kysu.edu', mens_phone: '502-295-0855', womens_coach: '—', womens_email: '', womens_phone: '', notes: '2025 SIAC Coach of Year' },
  { institution: 'LeMoyne-Owen College', division: 'NCAA D-II', conference: 'SIAC', region: 'Southeast', state: 'TN', mens_coach: 'Dominique Worthen', mens_email: 'dominique_worthen@loc.edu', mens_phone: '901-359-3858', womens_coach: 'Dominique Worthen', womens_email: '', womens_phone: '', notes: "Men's golf only" },
  { institution: 'Miles College', division: 'NCAA D-II', conference: 'SIAC', region: 'Southeast', state: 'AL', mens_coach: 'Leonard Smoot', mens_email: 'lsmoot@miles.edu', mens_phone: '205-929-1617', womens_coach: '—', womens_email: '', womens_phone: '', notes: 'BCGCA President; 4x SIAC Coach of Year; 2021 PGA WORKS DII Champs; 2024 SIAC Champs' },
  { institution: 'Morehouse College', division: 'NCAA D-II', conference: 'SIAC', region: 'Southeast', state: 'GA', mens_coach: 'Edgar Evans Jr.', mens_email: 'edgar.evansjr@morehouse.edu', mens_phone: '404-771-3056', womens_coach: '—', womens_email: '', womens_phone: '', notes: 'All-male institution; Evans appointed April 2024; added indoor simulator' },
  { institution: 'Savannah State University', division: 'NCAA D-II', conference: 'SIAC', region: 'Southeast', state: 'GA', mens_coach: 'Christopher Miller', mens_email: 'millerch@savannahstate.edu', mens_phone: '248-417-1300', womens_coach: 'Christopher Miller', womens_email: '', womens_phone: '', notes: "Men's and women's golf per master list" },
  // Other D-II
  { institution: 'Lincoln University of Missouri', division: 'NCAA D-II', conference: 'MIAA', region: 'Midwest', state: 'MO', mens_coach: 'Darshan Gunasegar', mens_email: 'GunasegarD@lincolnu.edu', mens_phone: '573-797-3951', womens_coach: 'Darshan Gunasegar', womens_email: '', womens_phone: '', notes: 'Ware departed to PVAMU July 2025; search underway' },
  { institution: 'West Virginia State University', division: 'NCAA D-II', conference: 'Mountain East Conference', region: 'Southeast', state: 'WV', mens_coach: 'Sonny Anderson', mens_email: '', mens_phone: '', womens_coach: '—', womens_email: '', womens_phone: '', notes: "Men's golf only" },
  // NAIA
  { institution: 'Fisk University', division: 'NAIA', conference: 'HBCUAC', region: 'Southeast', state: 'TN', mens_coach: 'Robert Moore', mens_email: 'rmoore@fisk.edu', mens_phone: '', womens_coach: 'Robert Moore', womens_email: 'rmoore@fisk.edu', womens_phone: '', notes: 'Golf Head Coach & Asst. Basketball coach; leads both programs' },
  // NJCAA
  { institution: 'Bishop State Community College', division: 'NJCAA', conference: 'ACCC', region: 'Southeast', state: 'AL', mens_coach: '', mens_email: '', mens_phone: '', womens_coach: 'TBD', womens_email: '', womens_phone: '', notes: 'Alabama community college; NJCAA ACCC member' },
  { institution: 'Hinds Community College @ Utica', division: 'NJCAA', conference: 'MACCC', region: 'Southeast', state: 'MS', mens_coach: '', mens_email: '', mens_phone: '', womens_coach: '—', womens_email: '', womens_phone: '', notes: "Men's golf only" },
  // Additional
  { institution: 'Chicago State University', division: 'NCAA D-I', conference: 'NEC', region: 'Midwest', state: 'IL', mens_coach: 'Jean Macon', mens_email: 'hmacon20@csu.edu', mens_phone: '704-957-5387', womens_coach: 'Jean Macon', womens_email: 'hmacon20@csu.edu', womens_phone: '773-995-3660', notes: 'NEC full member; Craig Bowen former head coach (departed to DSU 2024)' },
  { institution: 'Chowan University', division: 'NCAA D-II', conference: 'USA South AC', region: 'Southeast', state: 'NC', mens_coach: 'Mike Ordnung', mens_email: 'ordnum@chowan.edu', mens_phone: '252-578-3403', womens_coach: '—', womens_email: '', womens_phone: '', notes: 'Historically Black-affiliated; competed in 2025 CIAA Northern Tournament' },
  { institution: 'Paine College', division: 'NCCAA', conference: 'NCCAA Independent', region: 'Southeast', state: 'GA', mens_coach: 'Andre Lacey', mens_email: 'laceyaf@paine.edu', mens_phone: '706-619-0353', womens_coach: 'Andre Lacey', womens_email: 'laceyaf@paine.edu', womens_phone: '706-619-0353', notes: 'Paine left SIAC and NCAA in 2021 to join NCCAA as independent' },
];

const COLUMNS: { key: keyof Row; label: string }[] = [
  { key: 'institution', label: 'Institution' },
  { key: 'division', label: 'Division' },
  { key: 'conference', label: 'Conference' },
  { key: 'region', label: 'Region' },
  { key: 'state', label: 'State' },
  { key: 'mens_coach', label: "Men's Coach" },
  { key: 'mens_email', label: "Men's Email" },
  { key: 'mens_phone', label: "Men's Phone" },
  { key: 'womens_coach', label: "Women's Coach" },
  { key: 'womens_email', label: "Women's Email" },
  { key: 'womens_phone', label: "Women's Phone" },
  { key: 'notes', label: 'Notes / Status' },
];

const DEFAULT_VISIBLE: Record<string, boolean> = Object.fromEntries(COLUMNS.map(c => [c.key, true]));

export function HbcuProgramsTable() {
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState('all');
  const [conference, setConference] = useState('all');
  const [state, setState] = useState('all');
  const [region, setRegion] = useState('all');
  const [gender, setGender] = useState('all');
  const [sortKey, setSortKey] = useState<keyof Row>('institution');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [visible, setVisible] = useState<Record<string, boolean>>(DEFAULT_VISIBLE);

  const divisions = useMemo(() => Array.from(new Set(DATA.map(r => r.division))).sort(), []);
  const conferences = useMemo(() => Array.from(new Set(DATA.map(r => r.conference))).filter(Boolean).sort(), []);
  const states = useMemo(() => Array.from(new Set(DATA.map(r => r.state))).filter(Boolean).sort(), []);
  const regions = useMemo(() => Array.from(new Set(DATA.map(r => r.region))).filter(Boolean).sort(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = DATA.filter(r => {
      if (division !== 'all' && r.division !== division) return false;
      if (conference !== 'all' && r.conference !== conference) return false;
      if (state !== 'all' && r.state !== state) return false;
      if (region !== 'all' && r.region !== region) return false;
      if (gender === 'mens' && (!r.mens_coach || r.mens_coach === '—')) return false;
      if (gender === 'womens' && (!r.womens_coach || r.womens_coach === '—')) return false;
      if (gender === 'both' && ((!r.mens_coach || r.mens_coach === '—') || (!r.womens_coach || r.womens_coach === '—'))) return false;
      if (q) {
        const hay = Object.values(r).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list.sort((a, b) => {
      const av = (a[sortKey] || '').toString().toLowerCase();
      const bv = (b[sortKey] || '').toString().toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [search, division, conference, state, region, gender, sortKey, sortDir]);

  const toggleSort = (key: keyof Row) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const exportCsv = () => {
    const cols = COLUMNS.filter(c => visible[c.key]);
    const headers = cols.map(c => c.label);
    const rows = filtered.map(r => cols.map(c => `"${String(r[c.key] ?? '').replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hbcu-golf-programs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <CardTitle>HBCU Golf Programs Directory</CardTitle>
        </div>
        <CardDescription>
          Comprehensive 2025-26 directory of HBCU men's and women's golf programs. Filter, sort, hide columns, and export to CSV.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input placeholder="Search institutions, coaches, emails, notes…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={division} onValueChange={setDivision}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Division" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Divisions</SelectItem>{divisions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={conference} onValueChange={setConference}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Conference" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Conferences</SelectItem>{conferences.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="w-[110px]"><SelectValue placeholder="State" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All States</SelectItem>{states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Region" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Regions</SelectItem>{regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Programs" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="mens">Has Men's</SelectItem>
              <SelectItem value="womens">Has Women's</SelectItem>
              <SelectItem value="both">Has Both</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><Columns className="w-4 h-4 mr-1" />Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {COLUMNS.map(c => (
                <DropdownMenuCheckboxItem
                  key={c.key}
                  checked={!!visible[c.key]}
                  onCheckedChange={(v) => setVisible(prev => ({ ...prev, [c.key]: !!v }))}
                  onSelect={(e) => e.preventDefault()}
                >
                  {c.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-1" />CSV</Button>
          <Badge variant="secondary" className="ml-auto">{filtered.length} of {DATA.length}</Badge>
        </div>

        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.filter(c => visible[c.key]).map(c => (
                  <TableHead key={c.key}>
                    <button onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-foreground">
                      {c.label}
                      <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={COLUMNS.filter(c => visible[c.key]).length} className="text-center text-muted-foreground py-8">No programs match the filters.</TableCell></TableRow>
              )}
              {filtered.map((r, i) => (
                <TableRow key={`${r.institution}-${i}`}>
                  {COLUMNS.filter(c => visible[c.key]).map(c => {
                    const val = r[c.key];
                    if ((c.key === 'mens_email' || c.key === 'womens_email') && val) {
                      return <TableCell key={c.key} className="text-xs"><a className="text-primary hover:underline" href={`mailto:${val}`}>{val}</a></TableCell>;
                    }
                    if (c.key === 'notes') {
                      return <TableCell key={c.key} className="text-xs max-w-md text-muted-foreground">{val}</TableCell>;
                    }
                    if (c.key === 'institution') {
                      return <TableCell key={c.key} className="font-medium whitespace-nowrap">{val}</TableCell>;
                    }
                    return <TableCell key={c.key} className="text-sm whitespace-nowrap">{val || <span className="text-muted-foreground">—</span>}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
