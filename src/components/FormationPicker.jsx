export default function FormationPicker({formations,onPick}){
 return <div className="formation-grid">{formations.map(f=><button key={f.id} className="formation-card" onClick={()=>onPick(f)}><div className="mini-formation">{f.slots.map(s=><i key={s} style={{left:`${f.coords[s][0]}%`,top:`${f.coords[s][1]}%`}} />)}</div><strong>{f.name}</strong><small>{f.slots.join(" • ")}</small></button>)}</div>;
}
