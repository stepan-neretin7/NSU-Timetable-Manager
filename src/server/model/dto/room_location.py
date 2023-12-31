from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class RoomLocation:
    block: Optional[str]
    level: Optional[int]
    x: Optional[int]
    y: Optional[int]
    is_empty: bool = False


def create_empty_room_location() -> RoomLocation:
    return RoomLocation(block=None, level=None, x=None, y=None, is_empty=True)
