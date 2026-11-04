import base64, json, os, sys, time, requests
sys.path.insert(0,"/Users/genghiskhan/clawd/email-designs/faith-we-confess-2027")
sys.path.insert(0,"/Users/genghiskhan/clawd/mailchimp")
import oneup
from creds import load_mailchimp_creds
D=os.path.dirname(os.path.abspath(__file__)); S=os.path.join(D,"..","social")
plan=json.load(open(D+"/oneup_plan.json"))
CACHE=D+"/hosted_media.json"; LED=D+"/oneup_ledger.json"
media=json.load(open(CACHE)) if os.path.exists(CACHE) else {}
led=json.load(open(LED)) if os.path.exists(LED) else {}
key,srv,_=load_mailchimp_creds(); BASE=f"https://{srv}.api.mailchimp.com/3.0"
need=sorted({p[1] for s in plan for p in s["posts"].values()})
for f in need:
    if f in media: continue
    b64=base64.b64encode(open(os.path.join(S,f),"rb").read()).decode()
    r=requests.post(f"{BASE}/file-manager/files",auth=("x",key),json={"name":"myp2026_v5_"+f,"file_data":b64},timeout=120)
    r.raise_for_status(); media[f]=r.json()["full_size_url"]; json.dump(media,open(CACHE,"w"),indent=1)
    print("HOSTED",f,media[f],flush=True)
bad=[f for f in need if requests.head(media[f],timeout=30).status_code!=200]
if bad: print("BADMEDIA",bad); sys.exit(1)
NET={"fb":"134215983442","ig":"17841424835667193","x":"churchandfam_twitter"}
dry="--dry" in sys.argv
for s in plan:
    for net,(text,img) in s["posts"].items():
        lk=f"{s['slot']}|{net}"
        if lk in led: continue
        if dry: print("DRY",lk,s["when"],img,len(text)); continue
        r=oneup.post("scheduleimagepost",category_id=172540,social_network_id=json.dumps([NET[net]]),scheduled_date_time=s["when"],content=text,image_url=media[img])
        if r.get("error"): print("FAIL",lk,json.dumps(r)[:400]); sys.exit(1)
        led[lk]={"when":s["when"],"img":img,"post_ids":r.get("post_ids"),"msg":r.get("message")}
        json.dump(led,open(LED,"w"),indent=1); print("OK",lk,s["when"],r.get("post_ids"),flush=True); time.sleep(1.5)
total=sum(len(s["posts"]) for s in plan)
print("DONE",len(led),"of",total,"COMPLETE" if len(led)>=total else "INCOMPLETE")
