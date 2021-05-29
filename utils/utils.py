from typing import Optional


def mention_to_id(mention: Optional[str]) -> Optional[int]:
    if mention is None:
        return None
    mention = (
        mention.replace("<", "").replace(">", "").replace("!", "").replace("@", "")
    )
    return int(mention)
