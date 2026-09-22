export const money=n=>`₹${Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:2})}`;
export const dateTime=v=>new Date(v).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'});
export const dateOnly=v=>new Date(v).toLocaleDateString('en-IN',{dateStyle:'medium'});
