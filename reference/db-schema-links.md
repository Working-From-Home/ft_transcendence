- https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio

- https://drawio-app.com/entity-relationship-diagrams-with-draw-io/

- https://dba.stackexchange.com/questions/10199/how-should-i-design-a-relationship-table-for-friendship
|
 -> sublinks:
    - https://peter-zaitsev.livejournal.com/6949.html
    - https://www.percona.com/blog/2006/11/23/covering-index-and-prefix-indexes/
    - http://ronaldbradford.com/blog/tag/covering-index/

- https://dba.stackexchange.com/questions/68100/cassendra-schema-design-suggestion-for-chat-archive
- https://orientdb.com/docs/last/gettingstarted/Chat-use-case.html

#### good ones
- https://dba.stackexchange.com/questions/192172/how-to-create-a-flexible-table-schema-for-storing-messages-from-different-chats

- friendship should be mutual
- Foes/ban could be mutual or not ?

#### representation
- https://www.visual-paradigm.com/VPGallery/datamodeling/EntityRelationshipDiagram.html
- http://www.uml.org.cn/UMLTools/pdf/ermodeling.pdf
- http://www.csci.csusb.edu/dick/samples/uml1b.html

#### uml
- https://stackoverflow.com/questions/10993139/depicting-friend-relationship-between-classes-in-uml


Pb: ban should be mutual ?

#### a revoir au braiistorming:
    - relationship table attributes
    - on ne peut pas faire la difference entre un message direct et un groupe deux solutions:
        - Un, rajouter un champ dans ChatRoom
        - 2, creer une nouvelle table
        - 3, autre solution pas trop complique ?


